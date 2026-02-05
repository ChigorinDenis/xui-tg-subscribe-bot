export async function adminReplyHandler(ctx) {
  if (!ctx.isAdmin) return false;
  if (!ctx.user.state?.startsWith("admin_reply")) return false;

  const targetId = ctx.user.meta.replyTo;

  await ctx.bot.sendMessage(
    targetId,
    `💬 Ответ поддержки:\n${ctx.msg.text}`
  );

  ctx.user.state = "normal";
  ctx.save();

  return true;
}
