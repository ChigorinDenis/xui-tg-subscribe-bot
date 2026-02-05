
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

export const userKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: "🖥 Подписка" }],
      [{ text: "👥 Написать в поддержку" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

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
