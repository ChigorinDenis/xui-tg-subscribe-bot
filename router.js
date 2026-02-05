// router.js
import { supportModule } from "./modules/support";
import { adminModule } from "./modules/admin";
import { subscriptionModule } from "./modules/subscription";
import { commonHandlers } from "./modules/common";

const modules = [
  adminModule,
  supportModule,
  subscriptionModule,
  commonHandlers
];

export async function route(ctx) {
  for (const mod of modules) {
    const handled = await mod.handle(ctx);
    if (handled) return;
  }
}
