import { supportEnterHandler } from "./handlers.js";

export const supportEnterModule = {
  async handle(ctx) {
    return supportEnterHandler(ctx);
  }
};

