export async function adminReplyMessageHandler(ctx) {
  try {
    if (!ctx.isAdmin) return false;
    if (!ctx.admin?.state?.startsWith("reply:")) return false;
    if (ctx.callback) return false;

    const targetId = ctx.admin.state.split(":")[1];
    const targetUser = ctx.users[targetId];

    if (!targetUser) {
      console.error("Target user not found:", targetId);
      ctx.admin.state = "normal";
      await ctx.saveAdmins(ctx.admins);
      return false;
    }

    // 1️⃣ Проверяем тип сообщения
    if (!ctx.msg.text && !ctx.msg.photo && !ctx.msg.document) {
      await ctx.bot.sendMessage(ctx.chatId, "⚠️ Неподдерживаемый тип сообщения");
      return true;
    }

    // 2️⃣ Отправляем пользователю
    if (ctx.msg.text) {
      await ctx.bot.sendMessage(
        targetId,
        `💬 <b>Ответ поддержки:</b>\n\n${ctx.msg.text}`,
        {parse_mode: 'HTML'}
      );
    }

    if (ctx.msg.photo) {
      await ctx.bot.sendPhoto(
        targetId,
        ctx.msg.photo[ctx.msg.photo.length - 1].file_id,
        { caption: `💬 Ответ поддержки:\n\n${ctx.msg.caption || ""}` }
      );
    }

    if (ctx.msg.document) {
      await ctx.bot.sendDocument(
        targetId,
        ctx.msg.document.file_id,
        { caption: `💬 Ответ поддержки:\n\n${ctx.msg.caption || ""}` }
      );
    }

    // 3️⃣ Подтверждение админу
    await ctx.bot.sendMessage(
      ctx.chatId,
      "✅ Ответ отправлен",
      targetUser.supportTopicId
        ? { message_thread_id: targetUser.supportTopicId }
        : {}
    );

    // 4️⃣ Сброс состояний
    ctx.admin.state = "normal";
    targetUser.state = "normal";

    await ctx.saveAdmins(ctx.admins);
    await ctx.saveUsers(ctx.users);

    return true;

  } catch (err) {
    console.error("adminReplyMessageHandler error:", err);

    try {
      await ctx.bot.sendMessage(
        ctx.chatId,
        "❌ Ошибка при отправке ответа. Проверьте логи."
      );
    } catch (_) {}

    return true; 
  }
}
