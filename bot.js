import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { login, addClient, getLastOnline, getOnlineClients } from "./xui.js";
import { loadUsers, loadAdmins, saveUsers, saveAdmins } from "./storage.js";
import { lastOnlineToStr, onlineClientsToStr } from "./utils.js";
import { isAdmin } from "./auth.js";
// import { adminKeyboard } from "./adminMenu.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const users = loadUsers();
const admins = loadAdmins();

try {
  await login();
  console.log("✅ Logged into 3x-ui");
} catch (error) {
  console.log("❌ Ошибка Logging into 3x-ui", error);
}




bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const tgUser = msg.from;
  if (isAdmin(msg)) {
    admins[tgUser.id] = {
      chatId
    };
    saveAdmins(admins);

    bot.sendMessage(
      chatId,
      `✅ Приветствую тебя ${tgUser.username} в роли админа!\n`
    );
  } else {
    if (users[tgUser.id]) {
    bot.sendMessage(
      chatId,
      `🔐 Ваша подписка:\n${users[tgUser.id].url}\n\n Скопируйте ссылку!`
    );
    return;
  }

  try {
    const client = await addClient(
      Number(process.env.INBOUND_ID),
      tgUser
    );

    const url = `${process.env.SUB_BASE_URL}/${client.subId}`;

    users[tgUser.id] = {
      subId: client.subId,
      url
    };

    saveUsers(users);

    Object.values(admins).forEach((admin) => {
      bot.sendMessage(
        admin.chatId,
        `✅ Новый пользователь ${tgUser.username} получил ссылку. \n Его подписка: ${url}`
      );
    });

    bot.sendMessage(
      chatId,
      `✅ Готово!\n\nВаша подписка:\n${url}\n\n Скопируйте ссылку!`
    );

    bot

    
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Ошибка. Попробуйте позже.");
  }

  }

  
});

// bot.onText(/\/panel/, (msg) => {
//   if (!isAdmin(msg)) return;


//   bot.sendMessage(
//   msg.chat.id,
//   "👋 Админ-панель\nВыберите действие:",
//   adminKeyboard
//   );
// });




// Обработка кнопок
bot.on("message", async (msg) => {
  if (!isAdmin(msg)) return;

  const chatId = msg.chat.id;

  switch (msg.text) {
    case "🖥 Состояние сервера":
    
      bot.sendMessage(chatId, "🖥 Сервер работает нормально");
      break;

    case "👥 Клиенты онлайн":
     
      const obj1 = await getOnlineClients();
      const text1 = onlineClientsToStr(obj1);
      bot.sendMessage(chatId, `👥 Онлайн клиенты:\n${text1}`);
      break;

    case "🕒 Были в сети":
      const obj = await getLastOnline();
      const text = lastOnlineToStr(obj);
      bot.sendMessage(chatId, `🕒 Последние активности:\n${text}`);
      break;

    default:
      break; 
  }
});
