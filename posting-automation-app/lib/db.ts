import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDirectory = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPath = path.join(dbDirectory, "social_composer.db");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
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
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default Ronit lifestyle client if empty
const countClients = db.prepare("SELECT COUNT(*) as count FROM clients").get() as { count: number };
if (countClients.count === 0) {
  const insertClient = db.prepare(`
    INSERT INTO clients (id, name, connectMode, fbPageName, fbPageId, fbAccessToken, fbConnected)
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

export default db;
