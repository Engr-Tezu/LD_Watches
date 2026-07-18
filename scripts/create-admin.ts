import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import Admin from "../src/models/Admin";
import { hashPassword } from "../src/lib/auth";
import { configureMongoDns, resolveMongoUri } from "../src/lib/mongodb-uri";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const ADMIN_EMAIL = "admin@ldwatches.com";
const ADMIN_PASSWORD = "admin123";

async function createAdmin() {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.warn("Skipping admin setup: MONGODB_URI is not set.");
    return;
  }

  const email = ADMIN_EMAIL.toLowerCase();
  const password = ADMIN_PASSWORD;

  try {
    configureMongoDns();
    const uri = await resolveMongoUri(rawUri);

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    const hashedPassword = await hashPassword(password);

    const admin = await Admin.findOneAndUpdate(
      { email },
      { email, password: hashedPassword },
      { upsert: true, new: true }
    );

    console.log("\nAdmin account ready:");
    console.log(`  Email:    ${admin.email}`);
    console.log(`  Password: ${password}`);
    console.log("\nLogin at /admin");
  } catch (error) {
    console.error("\nFailed to create admin:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
