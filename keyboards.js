
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

export function supportEntryKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "💬 Написать в поддержку", callback_data: "support:enter" }],
    ],
  };
}


export function supportExitKeyboard() {
  return {
    keyboard: [
      [{ text: "❌ Завершить поддержку" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}


export const commands = [

    {

        command: 'start',
        description: 'Запуск бота'

    },
    {

        command: 'menu',
        description: 'Вызов меню'

    },

]
