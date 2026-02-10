import { normalFallbackHandler } from "./handlers.js";

export const normalFallbackModule = {
  async handle(ctx) {
    return normalFallbackHandler(ctx);
  }
};

