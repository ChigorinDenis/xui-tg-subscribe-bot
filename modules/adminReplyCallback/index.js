import { adminReplyCallbackHandler } from "./handlers.js";

export const adminReplyCallbackModule = {
  async handle(ctx) {
    return adminReplyCallbackHandler(ctx);
  }
};
