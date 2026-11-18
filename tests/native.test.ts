// The Android bridge must be invisible everywhere but inside the app, and must
// move bytes losslessly when it is there.

import test from "node:test";
import assert from "node:assert/strict";

type Call = { method: string; args: unknown };

function fakeCapacitor(calls: Call[], share: unknown = null) {
  const plugin = new Proxy(
    {},
    {
      get: (_t, method: string) => async (args: unknown) => {
        calls.push({ method, args });
        if (method === "saveClose") return { location: "Download/Decimen/x" };
        if (method === "getPendingShare") return { share };
        if (method === "addListener") return { remove: async () => undefined };
        return {};
      },
    },
  );
  (globalThis as Record<string, unknown>).Capacitor = {
    isNativePlatform: () => true,
    registerPlugin: () => plugin,
  };
}

// native.ts caches its lookup, so each scenario loads a fresh copy.
async function freshModule() {
  return (await import(`../shared/native.ts?${Math.random()}`)) as typeof import("../shared/native.ts");
}

test("on the plain web build the bridge is absent and does nothing", async () => {
  delete (globalThis as Record<string, unknown>).Capacitor;
  const mod = await freshModule();
  assert.equal(mod.isNativeApp(), false);
  assert.equal(await mod.saveFileNative("a.bin", "application/octet-stream", new Uint8Array(3)), false);
  assert.equal(await mod.takeShared(), null);
  mod.setSenderAwake(true); // must not throw
});

test("saving streams every byte through the bridge in order, then closes", async () => {
  const calls: Call[] = [];
  fakeCapacitor(calls);
  const mod = await freshModule();
  // Bigger than one chunk, and not a multiple of it.
  const bytes = new Uint8Array(768 * 1024 * 2 + 1234).map((_, i) => (i * 31) & 0xff);
  assert.equal(await mod.saveFileNative("big.bin", "", bytes), true);

  assert.equal(calls[0]!.method, "saveOpen");
  assert.deepEqual(calls[0]!.args, { name: "big.bin", mime: "application/octet-stream" });
  assert.equal(calls.at(-1)!.method, "saveClose");
  const appended = calls.filter((c) => c.method === "saveAppend");
  assert.equal(appended.length, 3);
  const joined = Buffer.concat(appended.map((c) => Buffer.from((c.args as { data: string }).data, "base64")));
  assert.ok(joined.equals(Buffer.from(bytes)), "bytes survive the base64 round trip");
});

test("a failed write aborts the save instead of leaving a half file", async () => {
  const calls: Call[] = [];
  fakeCapacitor(calls);
  (globalThis as unknown as { Capacitor: { registerPlugin: () => unknown } }).Capacitor.registerPlugin = () => ({
    saveOpen: async () => undefined,
    saveAppend: async () => {
      throw new Error("disk full");
    },
    saveAbort: async () => {
      calls.push({ method: "saveAbort", args: undefined });
    },
  });
  const mod = await freshModule();
  assert.equal(await mod.saveFileNative("x", "text/plain", new Uint8Array(10)), true);
  assert.deepEqual(calls.map((c) => c.method), ["saveAbort"]);
});

test("a shared text arrives as text; nothing pending is null", async () => {
  fakeCapacitor([], { kind: "text", text: "hello" });
  assert.deepEqual(await (await freshModule()).takeShared(), { text: "hello" });
  fakeCapacitor([], null);
  assert.equal(await (await freshModule()).takeShared(), null);
});

test("sender brightness maxes out while streaming and is released after", async () => {
  const calls: Call[] = [];
  fakeCapacitor(calls);
  const mod = await freshModule();
  mod.setSenderAwake(true);
  mod.setSenderAwake(false);
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(
    calls.map((c) => [c.method, JSON.stringify(c.args)]),
    [
      ["setBrightness", '{"level":1}'],
      ["keepAwake", '{"on":true}'],
      ["setBrightness", '{"level":-1}'],
      ["keepAwake", '{"on":false}'],
    ],
  );
});
