export async function adminReplyMessageHandler(ctx) {
  if (!ctx.isAdmin) return false;
  if (!ctx.admin?.state?.startsWith("reply:")) return false;
  if (ctx.callback) return false; // только message

  const targetId = ctx.admin.state.split(":")[1];

  await ctx.bot.sendMessage(
    targetId,
    `💬 Ответ поддержки:\n\n${ctx.msg.text}`
  );

  await ctx.bot.sendMessage(
    ctx.chatId,
    "✅ Ответ отправлен"
  );

  ctx.admin.state = "normal";
  ctx.users[targetId].state = "normal"
  ctx.saveAdmins(ctx.admins);
  ctx.saveUsers(ctx.users);

  return true
}
