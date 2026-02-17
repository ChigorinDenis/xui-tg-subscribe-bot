export async function adminReplyCallbackHandler(ctx) {
  if (!ctx.isAdmin) return false;
  if (!ctx.callback) return false;

  try {
    const data = ctx.callback.data;
    if (!data.startsWith("reply:")) return false;

    const targetUserId = data.split(":")[1];

    ctx.admin.state = `reply:${targetUserId}`;
    ctx.saveAdmins(ctx.admins);

    const targetUser = ctx.users[targetUserId];

    await ctx.bot.sendMessage(
    process.env.ADMIN_GROUP_ID,
    "✍️ Напишите сообщение пользователю",
    targetUser.supportTopicId
        ? { message_thread_id: targetUser.supportTopicId }
        : {}
  );
  } catch (err) {
    console.log('❌ Error in AdminReply', err)
  }

  return true;
}
