export async function adminReplyCallbackHandler(ctx) {
  if (!ctx.isAdmin) return false;
  if (!ctx.callback) return false;

  const data = ctx.callback.data;
  if (!data.startsWith("reply:")) return false;

  const targetUserId = data.split(":")[1];

  ctx.admin.state = `reply:${targetUserId}`;
  ctx.saveAdmins(ctx.admins);

  await ctx.bot.sendMessage(
    -1003794698154,
    "✍️ Напишите сообщение пользователю",
    { message_thread_id: ctx.users[targetUserId].supportTopicId }
  );

  return true;
}
