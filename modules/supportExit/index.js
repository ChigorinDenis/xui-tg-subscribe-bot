import { supportExitHandler } from "./handlers.js";

export const supportExitModule = {
  async handle(ctx) {
    return supportExitHandler(ctx);
  }
};

