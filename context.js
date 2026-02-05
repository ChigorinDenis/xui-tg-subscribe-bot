export function createContext({ bot, msg, users }) {
  const tgId = msg.from.id;

  users[tgId] ??= { state: "normal" };

  return {
    bot,
    msg,
    tgId,
    user: users[tgId],
    isAdmin: ADMINS.includes(tgId),
    save: () => saveUsers(users)
  };
}
