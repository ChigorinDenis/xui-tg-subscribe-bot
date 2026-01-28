// adminMenu.js
export const adminKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: "🖥 Состояние сервера" }],
      [{ text: "👥 Клиенты онлайн" }],
      [{ text: "🕒 Были в сети" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};
