import { adminInitHandler } from "./handlers.js";

export const adminInitModule = {
  async handle(ctx) {
    return adminInitHandler(ctx);
  }
};
