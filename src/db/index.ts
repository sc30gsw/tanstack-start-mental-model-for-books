import { config } from "dotenv";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
// import * as schema from "~/db/schema";

class DatabaseError extends Error {
  status = 500;

  constructor(message: string = "Database error occurred") {
    super(message);
    this.name = "DatabaseError";
  }
}

// TODO: typeof schema にする
let db: LibSQLDatabase<any> | null = null;

//! サーバーサイドでのみ環境変数・DBを読み込む
if (typeof window === "undefined") {
  config({ path: ".env" });

  db = drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
    // schema,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(): LibSQLDatabase<any> {
  if (!db) {
    throw new DatabaseError(
      "Database not initialized. This should only be called on the server side.",
    );
  }

  return db;
}
