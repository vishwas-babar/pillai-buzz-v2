import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import dotenv from "dotenv"

dotenv.config();

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

console.log(process.env.DATABASE_URL);


export const conn =
  globalForDb.conn ??
  postgres(process.env.DATABASE_URL as string, { 
    max: 1, 
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export * from "./schema";
