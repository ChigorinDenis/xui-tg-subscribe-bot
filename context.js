import { isAdmin } from "./auth.js";
import { saveAdmins, saveUsers } from "./storage.js";

export function createContext({ bot, update, users, admins  }) {
  // const tgId = msg.from.id;
  // const tgUsername = msg.from.username

  // users[tgId] ??= { mode: 'normal' };

  const isCallback = !!update.data;

  const from = isCallback ? update.from : update.from;
  const chat = isCallback ? update.message.chat : update.chat;

  return {
    bot,
    msg: isCallback ? update.message : update,
    callback: isCallback ? update : null,
    tgUser: from,
    chatId: chat.id,
    user: users[from.id],
    admin: admins[from.id],
    users,
    admins,
    isAdmin: isAdmin(from.id),
    saveUsers: (users) => saveUsers(users),
    saveAdmins: (admins) => saveAdmins(admins)
  };
}
