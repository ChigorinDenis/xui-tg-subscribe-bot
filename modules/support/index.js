import { supportHandler } from "./handlers.js";

export const supportModule = {
  async handle(ctx) {
    return supportHandler(ctx);
  }
};

