import fs from "fs";
import Database from "better-sqlite3";

const DB_PATH = "./bot.db";
const USERS_FILE = "./users.json";
const ADMINS_FILE = "./admins.json";

const db = new Database(DB_PATH);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    tg_id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'new',
    sub_id TEXT,
    url TEXT,
    created_at INTEGER,
    state TEXT DEFAULT 'normal'
  );

  CREATE TABLE IF NOT EXISTS admins (
    tg_id TEXT PRIMARY KEY,
    is_master INTEGER DEFAULT 0,
    created_at INTEGER
  );
`);

// Migrate users
if (fs.existsSync(USERS_FILE)) {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (tg_id, status, sub_id, url, created_at, state)
    VALUES (@tg_id, @status, @sub_id, @url, @created_at, @state)
  `);

  const insertMany = db.transaction((usersArr) => {
    for (const user of usersArr) {
      stmt.run(user);
    }
  });

  const usersArr = Object.entries(users).map(([tg_id, data]) => ({
    tg_id,
    status: data.status,
    sub_id: data.subId,
    url: data.url,
    created_at: data.createdAt,
    state: data.state
  }));

  insertMany(usersArr);
  console.log(`✅ Migrated ${usersArr.length} users to SQLite`);
} else {
  console.log('ℹ️ No users.json file found');
}

// Migrate admins
if (fs.existsSync(ADMINS_FILE)) {
  const admins = JSON.parse(fs.readFileSync(ADMINS_FILE));
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO admins (tg_id, is_master, created_at)
    VALUES (@tg_id, @is_master, @created_at)
  `);

  const insertMany = db.transaction((adminsArr) => {
    for (const admin of adminsArr) {
      stmt.run(admin);
    }
  });

  const adminsArr = Object.entries(admins).map(([tg_id, data]) => ({
    tg_id,
    is_master: data.isMaster || 0,
    created_at: data.createdAt
  }));

  insertMany(adminsArr);
  console.log(`✅ Migrated ${adminsArr.length} admins to SQLite`);
} else {
  console.log('ℹ️ No admins.json file found');
}

db.close();
console.log('✅ Migration completed!');
