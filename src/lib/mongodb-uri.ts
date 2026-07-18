import dns from "dns";

const PUBLIC_DNS = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];

export function configureMongoDns(): void {
  dns.setServers(PUBLIC_DNS);
}

function resolveSrvRecords(service: string): Promise<dns.SrvRecord[]> {
  configureMongoDns();
  return new Promise((resolve, reject) => {
    dns.resolveSrv(service, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses);
    });
  });
}

interface ParsedSrvUri {
  credentials: string;
  hostname: string;
  database: string;
  query: string;
}

function parseSrvUri(uri: string): ParsedSrvUri {
  const withoutScheme = uri.replace("mongodb+srv://", "");
  const atIndex = withoutScheme.indexOf("@");

  if (atIndex === -1) {
    throw new Error("Invalid mongodb+srv URI: missing credentials");
  }

  const credentials = withoutScheme.slice(0, atIndex);
  const remainder = withoutScheme.slice(atIndex + 1);
  const slashIndex = remainder.indexOf("/");

  if (slashIndex === -1) {
    const qIndex = remainder.indexOf("?");
    return {
      credentials,
      hostname: qIndex === -1 ? remainder : remainder.slice(0, qIndex),
      database: "",
      query: qIndex === -1 ? "" : remainder.slice(qIndex + 1),
    };
  }

  return {
    credentials,
    hostname: remainder.slice(0, slashIndex),
    database: remainder.slice(slashIndex + 1).split("?")[0],
    query: remainder.includes("?") ? remainder.split("?")[1] : "",
  };
}

/**
 * Converts mongodb+srv:// to mongodb:// by resolving SRV records manually.
 * Fixes querySrv ECONNREFUSED on Windows where the MongoDB driver SRV lookup fails.
 */
export async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const standardOverride = process.env.MONGODB_URI_STANDARD;
  if (standardOverride) {
    return standardOverride;
  }

  configureMongoDns();

  const { credentials, hostname, database, query } = parseSrvUri(uri);

  const records = await resolveSrvRecords(`_mongodb._tcp.${hostname}`);
  records.sort((a, b) => a.priority - b.priority || b.weight - a.weight);

  const hostList = records.map((r) => `${r.name}:${r.port}`).join(",");

  const params = new URLSearchParams(query);
  if (!params.has("ssl")) params.set("ssl", "true");
  if (!params.has("authSource")) params.set("authSource", "admin");
  if (!params.has("retryWrites")) params.set("retryWrites", "true");
  if (!params.has("w")) params.set("w", "majority");

  const dbPath = database ? `/${database}` : "";
  const queryString = params.toString();

  return `mongodb://${credentials}@${hostList}${dbPath}${queryString ? `?${queryString}` : ""}`;
}
