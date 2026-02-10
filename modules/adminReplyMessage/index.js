import { adminReplyMessageHandler } from "./handlers.js";

export const adminReplyMessageModule = {
  async handle(ctx) {
    return adminReplyMessageHandler(ctx);
  }
};
