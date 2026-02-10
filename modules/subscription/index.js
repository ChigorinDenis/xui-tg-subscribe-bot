import { subscriptionHandler } from "./handlers.js";

export const subscriptionModule = {
  async handle(ctx) {
    return subscriptionHandler(ctx);
  }
};

