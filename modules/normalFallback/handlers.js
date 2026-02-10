import { supportEntryKeyboard } from "../../keyboards.js";

export async function normalFallbackHandler(ctx) {
  if (ctx.user.state !== "normal") return false;
  if (ctx.callback) return false;

  await ctx.bot.sendMessage(
    ctx.chatId,
    "Выберите действие:",
    {
      reply_markup: supportEntryKeyboard(),
    }
  );

  return true;
}
