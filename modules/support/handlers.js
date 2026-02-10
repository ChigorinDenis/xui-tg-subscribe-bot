import { SUPPORT_STATE } from "./states.js";
import { SUPPORT_WAITING_STATE } from "./states.js";

export async function supportHandler(ctx) {
  if (ctx.user.state !== SUPPORT_STATE && ctx.user.state !== SUPPORT_WAITING_STATE) return false;

  if (ctx.user.state === SUPPORT_WAITING_STATE) {
    await ctx.bot.sendMessage(
    ctx.msg.chat.id,
    `Мы уже получили ваше сообщение.
    ⏳Пожалуйста дождитесь ответа от службы поддержки`
    );
    return true;
  }

  await ctx.bot.sendMessage(
    910027300,
    `🆘 SUPPORT\n👤 ID: ${ctx.tgUser.id}\nИмя пользователя: ${ctx.tgUser.username}\n\n${ctx.msg.text}`,
    {
    reply_markup: {
      inline_keyboard: [
        [{ text: "✍️ Ответить", callback_data: `reply:${ctx.tgUser.id}` }]
      ]
    }
  }
  );

  ctx.user.state = SUPPORT_WAITING_STATE
  ctx.saveUsers(ctx.users);

  await ctx.bot.sendMessage(
    ctx.msg.chat.id,
    "✅ Сообщение отправлено в поддержку"
  );

  return true;
}
