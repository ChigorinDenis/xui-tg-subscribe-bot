import { supportEntryKeyboard } from "../../keyboards.js";

export async function commandsHandler(ctx) {
  if (ctx.msg.text !== "/support") return false;

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
