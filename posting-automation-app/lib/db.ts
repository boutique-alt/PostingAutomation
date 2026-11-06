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
      gbpLocationName TEXT,
      gbpAccountId TEXT,
      gbpLocationId TEXT,
      gbpAccessToken TEXT,
      gbpConnected INTEGER DEFAULT 0,
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

  // Run safe migrations for existing tables if columns don't exist
  try {
    const tableInfo = db.prepare("PRAGMA table_info(clients)").all() as any[];
    const columnNames = tableInfo.map((c: any) => c.name);
    if (!columnNames.includes("gbpLocationName")) {
      db.exec("ALTER TABLE clients ADD COLUMN gbpLocationName TEXT;");
    }
    if (!columnNames.includes("gbpAccountId")) {
      db.exec("ALTER TABLE clients ADD COLUMN gbpAccountId TEXT;");
    }
    if (!columnNames.includes("gbpLocationId")) {
      db.exec("ALTER TABLE clients ADD COLUMN gbpLocationId TEXT;");
    }
    if (!columnNames.includes("gbpAccessToken")) {
      db.exec("ALTER TABLE clients ADD COLUMN gbpAccessToken TEXT;");
    }
    if (!columnNames.includes("gbpConnected")) {
      db.exec("ALTER TABLE clients ADD COLUMN gbpConnected INTEGER DEFAULT 0;");
    }
  } catch (migErr) {
    console.warn("Migration notice:", migErr);
  }

  // Auto-seed default Ronit lifestyle & Hasibul if empty so they are always ready immediately
  const countRow = db.prepare("SELECT COUNT(*) as cnt FROM clients").get() as { cnt: number };
  if (!countRow || countRow.cnt === 0) {
    const insertClient = db.prepare(`
      INSERT OR IGNORE INTO clients (
        id, name, connectMode,
        fbPageName, fbPageId, fbAccessToken, fbConnected,
        igUsername, igAccountId, igAccessToken, igConnected
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertClient.run(
      "proj_ronit",
      "Ronit lifestyle",
      "facebook",
      "Ronit lifestyle",
      "274954512375449",
      "EAA7rTrq82k4BSyHOauZABNsPwiD0PJ8kvabvrOMRZB7ZBmdKcrNa1zOmcjEpU5wMx01VFcOk0IziQqjmo4gVZCgkNAav1QR8MDETeonqpsJOgfZBZBAqBZC3vLgcecL7hppZBbvz5PhjOZAZAPxjGRCZCdPRRiiSv0C5q6ScZCs2vhEKnuNjOJO5lR4g6BZCETr9QConZCxmYZD",
      1,
      null,
      null,
      null,
      0
    );
    insertClient.run(
      "proj_hasibul",
      "Hasibul",
      "both",
      "Hasibul",
      "1415107628351660",
      "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
      1,
      "testing5810",
      "17841439096613191",
      "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
      1
    );
  } else {
    // Ensure Hasibul is always up-to-date with both Facebook & Instagram credentials
    const updateHasibul = db.prepare(`
      INSERT OR REPLACE INTO clients (
        id, name, connectMode,
        fbPageName, fbPageId, fbAccessToken, fbConnected,
        igUsername, igAccountId, igAccessToken, igConnected
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    updateHasibul.run(
      "proj_hasibul",
      "Hasibul",
      "both",
      "Hasibul",
      "1415107628351660",
      "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
      1,
      "testing5810",
      "17841439096613191",
      "EAA7rTrq82k4BS5AP2gyzC4XZCmZCMSGyogTyZCMYUNZBMgZB4uQzTZB89WmHX8ayqYpc4zofdZBzwsOG60lkA4R1Mk4vxOGNKml9Ungtj0ZBNZAmtCSXqYqkfZAVxZAzm6njTLJuNvT9ihwzSg2POPzrmk4LDlGygCDa9KnZCi6z4K0aGjqo5BDkdw4ZBOI6D9Vk7pudzHAVyRlnK",
      1
    );

    // Ensure Boutique Fashion (Google Business Profile) is always present
    const updateBoutique = db.prepare(`
      INSERT OR REPLACE INTO clients (
        id, name, connectMode,
        gbpLocationName, gbpLocationId, gbpAccessToken, gbpConnected
      )
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    updateBoutique.run(
      "proj_boutique",
      "Boutique Fashion",
      "gbp",
      "Boutique Fashion",
      "2766843255278767272",
      process.env.GBP_ACCESS_TOKEN || ""
    );
  }
} catch (e) {
  console.warn("SQLite initialization note (e.g. read-only serverless environment):", e);
}

export default db;
