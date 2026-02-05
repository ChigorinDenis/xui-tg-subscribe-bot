import { subscriptionHandler } from "./handlers";

export const subscriptionModule = {
  async handle(ctx) {
    return subscriptionHandler(ctx);
  }
};

