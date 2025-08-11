import { getPayload } from "payload";
import configPromise from "@payload-config";

declare global {
  var __payload: ReturnType<typeof getPayload> | undefined;
}

export const payload = await (globalThis.__payload ??= getPayload({
  config: configPromise,
}));
