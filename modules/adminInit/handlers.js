
export async function adminInitHandler(ctx) {
  if (!ctx.isAdmin) return false;
  if (ctx.msg.text !== "/start") return false;

  try {
    if (!ctx.admin) {
    ctx.admins[ctx.tgUser.id] = {
      id: ctx.tgUser.id,
      state: "normal",
      createdAt: Date.now(),
    };
    ctx.saveAdmins(ctx.admins);
    }

    await ctx.bot.sendMessage(
      ctx.chatId,
      "👋 Привет, админ.\nВы в панели поддержки."
    );
    
  } catch (err) {
    console.log('❌ Error in AdminInit', err)
  }

  

  return true;
}
