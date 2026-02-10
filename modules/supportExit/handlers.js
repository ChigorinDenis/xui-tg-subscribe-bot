export async function supportExitHandler(ctx) {
  if (ctx.msg.text !== "❌ Завершить поддержку") return false;
  if (ctx.user.state !== "support") return false;

  ctx.user.state = "normal";
  ctx.saveUsers();

  await ctx.bot.sendMessage(
    ctx.chatId,
    "✅ Диалог завершён",
  );

  return true;
}
