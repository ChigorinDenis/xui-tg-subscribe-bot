import { SUPPORT_STATE } from "./states.js";
import { SUPPORT_WAITING_STATE } from "./states.js";

export async function supportHandler(ctx) {
  if (ctx.user?.state !== SUPPORT_STATE && ctx.user?.state !== SUPPORT_WAITING_STATE) return false;

  if (ctx.user.state === SUPPORT_WAITING_STATE) {
    await ctx.bot.sendMessage(
    ctx.msg.chat.id,
    `Мы уже получили ваше сообщение.
    ⏳Пожалуйста дождитесь ответа от службы поддержки`
    );
    return true;
  }

  if (!ctx.user?.supportTopicId) {
    const topic = await ctx.bot.createForumTopic(
      process.env.ADMIN_GROUP_ID,
      `👤 ${ctx.msg.from.username || ctx.msg.from.id}`
    );

    ctx.user.supportTopicId = topic.message_thread_id;
    await ctx.saveUsers(ctx.users);
  }

  await ctx.bot.sendMessage(
    process.env.ADMIN_GROUP_ID,
    `📩 Новое обращение от ${ctx.msg.from.username || ctx.msg.from.id}\n\n${ctx.msg.text}`,
     { message_thread_id: ctx.user.supportTopicId,
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



