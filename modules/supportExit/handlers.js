export async function supportExitHandler(ctx) {
  if (!ctx.callback) return false;
  if (ctx.callback.data !== "support:exit") return false;
  try {
    ctx.user.state = "normal";
    ctx.saveUsers(ctx.users);

    await ctx.bot.sendMessage(
      ctx.chatId,
      "✅ Диалог завершён",
    );

  } catch (err) {
    console.log('❌ Error in support exit', err);
  }

  return true;
}
