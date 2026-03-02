import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { login  } from "./xui.js";
import { loadUsers, loadAdmins } from "./storage.js";


import { commands} from "./keyboards.js";
import { createContext } from "./context.js";
import { route } from "./router.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
bot.setMyCommands(commands);



// try {
//   await login();
//   console.log("✅ Logged into 3x-ui");
// } catch (error) {
//   console.log("❌ Ошибка Logging into 3x-ui", error);
// }

bot.on("message", async (msg) => {
  const users = loadUsers();
  const admins = loadAdmins();
  const ctx = createContext({
    bot,
    update: msg,
    users,
    admins
  });
  await route(ctx);
});


bot.on("callback_query", async (query) => {
  const users = loadUsers();
  const admins = loadAdmins();
  const ctx = createContext({
    bot,
    update: query,
    users,
    admins
  });
  await route(ctx);
});



// bot.onText(/\/start/, async (msg) => {
//   const chatId = msg.chat.id;
//   const tgUser = msg.from;
//   const user = users[tgUser.id];

//   if (isAdmin(msg)) {
//     admins[tgUser.id] = {
//       chatId
//     };

//     saveAdmins(admins);

//     bot.sendMessage(
//       chatId,
//       `✅ Приветствую тебя ${tgUser.username} в роли админа!\n`
//     );
//   } 
  
//   if (user?.status === 'ready') {
//     const replyMarkup = makeCopyBtn('Скопировать ссылку', user.url);
//     return bot.sendMessage(
//       chatId,
//       `🔐 Ваша подписка:\n${user.url}\n\n Скопируйте ссылку!`,
//       {
//         reply_markup: replyMarkup
//       }
//     );
//   }

//   if (user?.status === 'pending') {
//     return bot.sendMessage(
//       chatId,
//       `⏳ Подписка ещё готовится.
//       Пожалуйста, подождите несколько секунд и нажмите /start ещё раз.`
//     );
//   }

//   users[tgUser.id] = {
//     status: "pending",
//     createdAt: Date.now()
//   };

//   saveUsers(users);
  
//   bot.sendMessage(
//     chatId,
//     "⏳ Подготавливаем подписку, пожалуйста подождите…"
//   );

//   try {
//     const client = await addClient(
//       Number(process.env.INBOUND_ID),
//       tgUser
//     );

//     const url = `${process.env.SUB_BASE_URL}/${client.subId}`;

//     users[tgUser.id] = {
//       status: 'ready',
//       subId: client.subId,
//       url,
//       createdAt: Date().now,
//       mode: 'normal'
//     };

//     saveUsers(users);

//     Object.values(admins).forEach((admin) => {
//       bot.sendMessage(
//         admin.chatId,
//         `✅ Новый пользователь ${tgUser.username} получил ссылку. \n Его подписка: ${url}`
//       );
//     });
//     setTimeout(() => {
//       const replyMarkup = makeCopyBtn('Скопировать ссылку', url);
//       bot.sendMessage(
//       chatId,
//       `✅ Готово!\n\nВаша подписка:\n${url}\n\n Скопируйте ссылку!`,
//       {
//         reply_markup: replyMarkup
//       }
//     );

//     }, 1000);
    

    
//   } catch (e) {
//     console.error(e);
//      bot.sendMessage(
//       chatId,
//       "⏳ Возникла небольшая задержка.\n" +
//       "Подождите 10–20 секунд и нажмите /start ещё раз."
//     );
//   }
// });

// bot.onText(/\/menu/, (msg) => {
//   bot.sendMessage(
//   msg.chat.id,
//   "👋 Выберите действие",
//   userKeyboard
//   );
// });




// bot.on('message', async (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from?.id;
//   const user = users[userId];
//   switch (msg.text) {
//     case '👥 Написать в поддержку':
//       bot.sendMessage(chatId, '✍️ Напишите сообщение — я передам его в поддержку');
//       users[userId] = {
//         ...user,
//         mode: 'support'
//       };
//       saveUsers(users);
//       break;
//     default:
//       break;
//   }
// });

// bot.on ('text', async (msg) => {
//   const userId = msg.from?.id;
//   const text = msg.text;
//   const user = users[userId];
//   if (!user) {
//     console.log('этот юзер не получил еще подписку');
//     return;
//   }
//   if (user.mode === 'support') {
//     bot.sendMessage(
//       chatId,
//       `🎧 Новое обращение
//        👤 TG ID: ${userId}
//        💬 Сообщение:
//       «${text}»`
//     );
//   }
//   console.log(msg);
// })

// Обработка кнопок
// bot.on("message", async (msg) => {
//   if (!isAdmin(msg)) return;

//   const chatId = msg.chat.id;

//   switch (msg.text) {
//     case "🖥 Состояние сервера":
    
//       bot.sendMessage(chatId, "🖥 Сервер работает нормально");
//       break;

//     case "👥 Клиенты онлайн":
     
//       const obj1 = await getOnlineClients();
//       const text1 = onlineClientsToStr(obj1);
//       bot.sendMessage(chatId, `👥 Онлайн клиенты:\n${text1}`);
//       break;

//     case "🕒 Были в сети":
//       const obj = await getLastOnline();
//       const text = lastOnlineToStr(obj);
//       bot.sendMessage(chatId, `🕒 Последние активности:\n${text}`);
//       break;

//     default:
//       break; 
//   }
// });
