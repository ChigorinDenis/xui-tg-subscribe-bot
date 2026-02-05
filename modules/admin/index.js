import { adminReplyHandler } from "./handlers";

export const adminModule = {
  async handle(ctx) {
    return adminReplyHandler(ctx);
  }
};
