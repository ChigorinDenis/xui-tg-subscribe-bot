import { commandsHandler } from "./handlers.js";

export const commandsModule = {
  async handle(ctx) {
    return commandsHandler(ctx);
  }
};

