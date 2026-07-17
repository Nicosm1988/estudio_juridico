import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_NOT_CONFIGURED");
  const client = postgres(url, { prepare: false, max: 1 });
  return drizzle(client);
}
