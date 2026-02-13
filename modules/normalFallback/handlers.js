import { supportEntryKeyboard } from "../../keyboards.js";

export async function normalFallbackHandler(ctx) {
  if (ctx.user?.state !== "normal") return false;
  if (ctx.callback) return false;

  await ctx.bot.sendMessage(
    ctx.chatId,
    `🤖 Вы хотите написать в поддержку?

      Пожалуйста, выберите действие ниже.`,
    {
      reply_markup: supportEntryKeyboard(),
    }
  );

  return true;
}
