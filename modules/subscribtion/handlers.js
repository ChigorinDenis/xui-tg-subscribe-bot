export async function subscriptionHandler(ctx) {
  if (ctx.msg.text !== "/start") return false;

  await ctx.bot.sendMessage(
    ctx.msg.chat.id,
    "🔐 Ваша подписка готовится..."
  );

  // логика создания / получения подписки

  return true;
}
