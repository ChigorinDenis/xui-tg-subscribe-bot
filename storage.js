import fs from "fs";

const FILE = "./users.json";
const FILE1 = "./admins.json"
export function loadUsers() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE));
}

export function loadAdmins() {
  if (!fs.existsSync(FILE1)) return {};
  return JSON.parse(fs.readFileSync(FILE1));
}

export function saveUsers(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function saveAdmins(data) {
  fs.writeFileSync(FILE1, JSON.stringify(data, null, 2));
}

