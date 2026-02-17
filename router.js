// router.js
import { supportModule } from "./modules/support/index.js";
import { adminInitModule } from "./modules/adminInit/index.js";
import { adminReplyCallbackModule } from "./modules/adminReplyCallback/index.js";
import { adminReplyMessageModule } from "./modules/adminReplyMessage/index.js";
import { supportEnterModule } from "./modules/supportEnter/index.js";
import { supportExitModule } from "./modules/supportExit/index.js";
import { subscriptionModule } from "./modules/subscription/index.js";
import { normalFallbackModule } from "./modules/normalFallback/index.js";
import { commandsModule } from "./modules/commands/index.js";

const modules = [
  adminInitModule,
  adminReplyCallbackModule,
  adminReplyMessageModule,
  supportEnterModule,
  supportExitModule,
  supportModule,
  subscriptionModule,
  commandsModule
];

export async function route(ctx) {
  for (const mod of modules) {
    const handled = await mod.handle(ctx);
    if (handled) return;
  }
}
