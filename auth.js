const ADMINS = process.env.ADMIN_IDS
.split(",")
.map(id => Number(id));


export function isAdmin(msg) {
return ADMINS.includes(msg.from.id);
}
