export async function supportExitHandler(ctx) {
  if (!ctx.callback) return false;
  if (ctx.callback.data !== "support:exit") return false;
  // if (ctx.msg.text !== "❌ Завершить поддержку") return false;
  // if (ctx.user.state !== "support") return false;

  ctx.user.state = "normal";
  ctx.saveUsers(ctx.users);

  await ctx.bot.sendMessage(
    ctx.chatId,
    "✅ Диалог завершён",
  );
  console.log('data',  ctx.callback)
  //  await ctx.bot.answerCallbackQuery("✅ Диалог завершён")

  return true;
}
