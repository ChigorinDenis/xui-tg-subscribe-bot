import { supportHandler } from "./handlers";

export const supportModule = {
  async handle(ctx) {
    return supportHandler(ctx);
  }
};

