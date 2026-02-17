import { supportExitKeyboard } from "../../keyboards.js";


export async function supportEnterHandler(ctx) {
  if (!ctx.callback) return false;
  if (ctx.callback.data !== "support:enter") return false;

  try {
    if (ctx.user.state === "support") {
      await ctx.bot.sendMessage(
        ctx.chatId,
        "💬 Вы уже находитесь в режиме поддержки. Напишите сообщение."
      );
      return true;
    }

    ctx.user.state = "support";
    ctx.saveUsers(ctx.users);

    await ctx.bot.sendMessage(
      ctx.chatId,
      "✍️ Напишите сообщение, мы скоро ответим.\n\n" +
      "Или чтобы выйти — нажмите «Завершить»",
      {
        reply_markup: supportExitKeyboard(),
      }
    );

  } catch (err) {
    console.log('❌ Error in suppor Enter', err);
  }

  return true;
}
