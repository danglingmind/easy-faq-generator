import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// DATABASE_URL is set via Fly.io secrets at runtime
// For local development, set it in .env.local
// Fallback value allows build to complete even if DATABASE_URL is not set
const dbUrl = process.env.DATABASE_URL;

// Use the DATABASE_URL with fallback for build-time module evaluation
const sql = neon(dbUrl || "postgresql://build:build@localhost/build");
export const db = drizzle(sql, { schema });

export * from "./schema";
