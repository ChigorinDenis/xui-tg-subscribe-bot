import { addClient } from "../../xui.js";
import { makeCopyBtn } from "../../utils.js";
import { SUBSCRIBTION_STATE } from "./states.js";

export async function subscriptionHandler(ctx) {
  if (ctx.msg.text !== "/start") return false;
  

  const { user = {}, users, tgUser, saveUsers, bot } = ctx;
  const chatId = ctx.msg.chat.id;
  const tgId = tgUser.id;
  
  if (!(tgId in users)) {
    await bot.sendMessage(
      chatId,
      `👋 Добро пожаловать, ${tgUser.first_name || tgUser.username}!\n Вы находитесь в сервисе подключения доступа.\n Здесь же вы сможете получить помощь`
    );
  }

  // ✅ ГОТОВО — просто отдаём
  if (user.status === "ready" && user.url) {
    const replyMarkup = makeCopyBtn("Скопировать ссылку", user.url);
    await bot.sendMessage(
      chatId,
      `🔐 Ваша подписка:\n${user.url}`,
      { reply_markup: replyMarkup }
    );

    
    return true;
  }

  // 🟡 pending — но если нет subId, продолжаем создание
  if (user.status === "pending") {
    await bot.sendMessage(
      chatId,
      "⏳ Подписка готовится, пробуем продолжить…"
    );
  } else {
    // 🆕 первый вход
    users[tgId] = {
      status: "pending",
      createdAt: Date.now()
    };
    saveUsers(users);

    await bot.sendMessage(
      chatId,
      "⏳ Подготавливаем подписку, пожалуйста подождите…"
    );
  }

  // 🔁 ОБЩАЯ точка создания подписки
  try {
    const client = await addClient(
      Number(process.env.INBOUND_ID),
      tgUser
    );

    const url = `${process.env.SUB_BASE_URL}/${client.subId}`;

    users[tgId] = {
      status: "ready",
      subId: client.subId,
      url,
      createdAt: Date.now(),
      state: SUBSCRIBTION_STATE
    };

    saveUsers(users);

    const replyMarkup = makeCopyBtn("Скопировать ссылку", url);
    await bot.sendMessage(
      chatId,
      `✅ Готово!\n\nВаша подписка:\n${url}`,
      { reply_markup: replyMarkup }
    );
    bot.sendMessage(
      process.env.ADMIN_IDS,
      `✅ Новый пользователь ${tgUser.username} получил ссылку. \n Его подписка: ${url}`
    );

    

  } catch (e) {
    console.error("addClient error:", e);

    // ⚠️ ВАЖНО: не оставляем пользователя навечно в pending
    users[tgId] = {
      ...users[tgId],
      status: "error",
      lastErrorAt: Date.now()
    };

    saveUsers(users);

    await bot.sendMessage(
      chatId,
      "⚠️ Возникла задержка при создании подписки.\n" +
      "Подождите 10–20 секунд и нажмите /start ещё раз."
    );
  }

  return true;
}
