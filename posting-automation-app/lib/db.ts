import path from "path";
import fs from "fs";

let db: any = null;

try {
  const Database = require("better-sqlite3");
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  // On Vercel / serverless, writeable directory is /tmp
  const dbDirectory = isVercel ? "/tmp" : path.join(process.cwd(), "data");

  if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  const dbPath = path.join(dbDirectory, "social_composer.db");
  db = new Database(dbPath);

  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      connectMode TEXT NOT NULL,
      fbPageName TEXT,
      fbPageId TEXT,
      fbAccessToken TEXT,
      fbConnected INTEGER DEFAULT 0,
      igUsername TEXT,
      igAccountId TEXT,
      igAccessToken TEXT,
      igConnected INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      projectName TEXT NOT NULL,
      platforms TEXT NOT NULL,
      postType TEXT NOT NULL,
      caption TEXT,
      status TEXT NOT NULL,
      errorMessage TEXT,
      time TEXT NOT NULL,
      mediaCount INTEGER DEFAULT 0,
      scheduleEpoch INTEGER,
      mediaPath TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (e) {
  console.warn("SQLite initialization note (e.g. read-only serverless environment):", e);
}

export default db;

export default db;
