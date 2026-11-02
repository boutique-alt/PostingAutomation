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

  // Auto-seed default Ronit lifestyle if empty so it's always ready immediately
  const countRow = db.prepare("SELECT COUNT(*) as cnt FROM clients").get() as { cnt: number };
  if (!countRow || countRow.cnt === 0) {
    const insertClient = db.prepare(`
      INSERT OR IGNORE INTO clients (id, name, connectMode, fbPageName, fbPageId, fbAccessToken, fbConnected)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertClient.run(
      "proj_ronit",
      "Ronit lifestyle",
      "facebook",
      "Ronit lifestyle",
      "274954512375449",
      "EAA7rTrq82k4BSyHOauZABNsPwiD0PJ8kvabvrOMRZB7ZBmdKcrNa1zOmcjEpU5wMx01VFcOk0IziQqjmo4gVZCgkNAav1QR8MDETeonqpsJOgfZBZBAqBZC3vLgcecL7hppZBbvz5PhjOZAZAPxjGRCZCdPRRiiSv0C5q6ScZCs2vhEKnuNjOJO5lR4g6BZCETr9QConZCxmYZD",
      1
    );
  }
} catch (e) {
  console.warn("SQLite initialization note (e.g. read-only serverless environment):", e);
}

export default db;
