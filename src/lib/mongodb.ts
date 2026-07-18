import mongoose from "mongoose";
import { configureMongoDns, resolveMongoUri } from "./mongodb-uri";

// Apply DNS fix as early as possible for any code path
configureMongoDns();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const connectOptions = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please define MONGODB_URI in your environment variables");
  }

  configureMongoDns();

  const resolvedUri = await resolveMongoUri(uri);
  return mongoose.connect(resolvedUri, connectOptions);
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connectToDatabase().catch((error) => {
      cached.promise = null;
      cached.conn = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
