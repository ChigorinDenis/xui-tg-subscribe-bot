import Database from "better-sqlite3";

const DB_PATH = "./bot.db";

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

export function loadUsers() {
  const rows = db.prepare("SELECT * FROM users").all();
  const users = {};
  for (const row of rows) {
    users[row.tg_id] = {
      status: row.status,
      subId: row.sub_id,
      url: row.url,
      createdAt: row.created_at,
      state: row.state
    };
  }
  return users;
}

export function loadAdmins() {
  const rows = db.prepare("SELECT * FROM admins").all();
  const admins = {};
  for (const row of rows) {
    admins[row.tg_id] = {
      isMaster: row.is_master,
      createdAt: row.created_at
    };
  }
  return admins;
}

export function saveUsers(users) {
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
}

export function saveAdmins(admins) {
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
}

// Additional helper functions for individual user operations
export function getUser(tgId) {
  const row = db.prepare("SELECT * FROM users WHERE tg_id = ?").get(tgId);
  if (!row) return null;
  return {
    status: row.status,
    subId: row.sub_id,
    url: row.url,
    createdAt: row.created_at,
    state: row.state
  };
}

export function setUser(tgId, data) {
  db.prepare(`
    INSERT OR REPLACE INTO users (tg_id, status, sub_id, url, created_at, state)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(tgId, data.status, data.subId, data.url, data.createdAt, data.state);
}

export function deleteUser(tgId) {
  db.prepare("DELETE FROM users WHERE tg_id = ?").run(tgId);
}

export function getAdmin(tgId) {
  const row = db.prepare("SELECT * FROM admins WHERE tg_id = ?").get(tgId);
  if (!row) return null;
  return {
    isMaster: row.is_master,
    createdAt: row.created_at
  };
}

export function setAdmin(tgId, data) {
  db.prepare(`
    INSERT OR REPLACE INTO admins (tg_id, is_master, created_at)
    VALUES (?, ?, ?)
  `).run(tgId, data.isMaster || 0, data.createdAt);
}

export function deleteAdmin(tgId) {
  db.prepare("DELETE FROM admins WHERE tg_id = ?").run(tgId);
}

export function closeDb() {
  db.close();
}
