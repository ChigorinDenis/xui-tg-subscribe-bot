export const lastOnlineToStr = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const date = new Date(value).toLocaleDateString();
    acc += `${key} был в сети: ${date}\n`;
    return acc;
  }, '');
}

export const onlineClientsToStr = (obj) => {
  return obj && obj.reduce((acc, value) => {
    acc += `🟢 ${value}\n`;
    return acc;
  }, '');
}

export const makeCopyBtn = (text ,copyText) => {
  const replyMarkup = {
      inline_keyboard: [[
        {
          text,
          copy_text: { text: copyText }
        }
      ]]
    }
  return replyMarkup;
}
