const ADMINS = process.env.ADMIN_IDS
.split(",")
.map(id => Number(id));


export function isAdmin(id) {
  return ADMINS.includes(id);
}
