import { SUPPORT_STATE, SUPPORT_WAITING_STATE } from "./states.js";

export async function supportHandler(ctx) {
  try {
    // Проверка состояния пользователя
    if (
      ctx.user?.state !== SUPPORT_STATE &&
      ctx.user?.state !== SUPPORT_WAITING_STATE
    ) return false;

    // Если уже ждёт ответа
    if (ctx.user.state === SUPPORT_WAITING_STATE) {
      await ctx.bot.sendMessage(
        ctx.msg.chat.id,
        `Мы уже получили ваше сообщение.\n⏳ Пожалуйста дождитесь ответа от службы поддержки`
      );
      return true;
    }

    // Проверка текста сообщения
    // if (!ctx.msg?.text) {
    //   await ctx.bot.sendMessage(
    //     ctx.msg.chat.id,
    //     "❗ Пожалуйста отправьте текстовое сообщение."
    //   );
    //   return true;
    // }

    // Проверка ADMIN_GROUP_ID
    if (!process.env.ADMIN_GROUP_ID) {
      console.error("ADMIN_GROUP_ID not set");
      await ctx.bot.sendMessage(
        ctx.msg.chat.id,
        "⚠️ Временная ошибка сервера. Попробуйте позже."
      );
      return true;
    }

    // Создание темы, если её нет
    if (!ctx.user.supportTopicId) {
      try {
        const topic = await ctx.bot.createForumTopic(
          process.env.ADMIN_GROUP_ID,
          `👤 ${ctx.msg.from.username || ctx.msg.from.id}`
        );

        ctx.user.supportTopicId = topic.message_thread_id;
        await ctx.saveUsers(ctx.users);
      } catch (err) {
        console.error("Error creating forum topic:", err);
        await ctx.bot.sendMessage(
          ctx.msg.chat.id,
          "⚠️ Не удалось создать обращение. Попробуйте позже."
        );
        return true;
      }
    }

    // Отправка сообщения в админ-группу
    try {
      if (!ctx.msg.text && !ctx.msg.photo && !ctx.msg.document) {
        await ctx.bot.sendMessage(ctx.chatId, "⚠️ Неподдерживаемый тип сообщения");
        return true;
      }
      const opt = {
          message_thread_id: ctx.user.supportTopicId,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✍️ Ответить",
                  callback_data: `reply:${ctx.tgUser.id}`
                }
              ]
            ]
          }
      };

      if (ctx.msg.text) {
        await ctx.bot.sendMessage(
        process.env.ADMIN_GROUP_ID,
        `📩 Новое обращение от ${ctx.msg.from.username || ctx.msg.from.id}\n\n${ctx.msg.text}`,
        {...opt}
        );
      }
      if (ctx.msg.photo) {
          await ctx.bot.sendPhoto(
          process.env.ADMIN_GROUP_ID,
          ctx.msg.photo[ctx.msg.photo.length - 1].file_id,
          { ...opt, caption: `📩 Новое обращение от\n\n${ctx.msg.caption || ""}` }
        );
      }
      if (ctx.msg.document) {
        await ctx.bot.sendDocument(
        process.env.ADMIN_GROUP_ID,
        ctx.msg.document.file_id,
        { ...opt, caption: `📩 Новое обращение от\n\n${ctx.msg.caption || ""}` }
      );
      }
      
    } catch (err) {
      console.error("Error sending message to admin group:", err);
      await ctx.bot.sendMessage(
        ctx.msg.chat.id,
        "⚠️ Ошибка отправки обращения. Попробуйте позже."
      );
      return true;
    }

    // Меняем состояние только после успешной отправки
    ctx.user.state = SUPPORT_WAITING_STATE;
    await ctx.saveUsers(ctx.users);

    // Подтверждение пользователю
    await ctx.bot.sendMessage(
      ctx.msg.chat.id,
      "✅ Сообщение отправлено в поддержку"
    );

    return true;

  } catch (err) {
    console.error("Critical error in supportHandler:", err);

    try {
      await ctx.bot.sendMessage(
        ctx.msg?.chat?.id,
        "⚠️ Произошла ошибка. Попробуйте позже."
      );
    } catch (_) {}

    return true;
  }
}
