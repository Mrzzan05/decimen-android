// Bridge to the Android shell (android/app/src/main/java/.../DecimenNativePlugin.java).
//
// Everything here is a no-op on the plain web build: `native()` returns null
// unless the page is running inside the Capacitor WebView, so the PWA, the
// standalone HTML files, and the node tests never touch it. The plugin is
// looked up on the global Capacitor object the native runtime injects, so the
// web bundle carries no @capacitor/* import.
//
// Why a bridge at all: the WebView drops `<a download>` on blob URLs (the
// received file would vanish), cannot receive the Android Share sheet, and has
// no way to raise screen brightness. Each of those is one small native call.

type SharedFileInfo = { kind: "file"; name: string; mime: string; size: number };
type SharedTextInfo = { kind: "text"; text: string };
export type PendingShare = SharedFileInfo | SharedTextInfo | null;

interface DecimenNativePlugin {
  saveOpen(opts: { name: string; mime: string }): Promise<void>;
  saveAppend(opts: { data: string }): Promise<void>;
  saveClose(): Promise<{ location: string }>;
  saveAbort(): Promise<void>;
  setBrightness(opts: { level: number }): Promise<void>;
  keepAwake(opts: { on: boolean }): Promise<void>;
  getPendingShare(opts: { consume: boolean }): Promise<{ share: PendingShare }>;
  readSharedChunk(opts: { offset: number; length: number }): Promise<{ data: string }>;
  finishShare(): Promise<void>;
  addListener(
    event: "shareReceived",
    cb: () => void,
  ): Promise<{ remove: () => Promise<void> }>;
}

interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  registerPlugin?: <T>(name: string) => T;
}

let cached: DecimenNativePlugin | null | undefined;

/** The native plugin, or null anywhere but inside the Android app. */
export function native(): DecimenNativePlugin | null {
  if (cached !== undefined) return cached;
  const cap = (globalThis as { Capacitor?: CapacitorGlobal }).Capacitor;
  cached =
    cap?.isNativePlatform?.() && cap.registerPlugin
      ? cap.registerPlugin<DecimenNativePlugin>("DecimenNative")
      : null;
  return cached;
}

export const isNativeApp = (): boolean => native() !== null;

// ~768 KB of bytes per bridge call: base64 inflates by a third, and the bridge
// moves each call as one JSON string, so smaller calls keep memory flat on a
// 64 MB file without making the call count silly.
const CHUNK_BYTES = 768 * 1024;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(text: string): Uint8Array {
  const binary = atob(text);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/**
 * Save received bytes into the phone's Downloads/Decimen folder. The native
 * side shows its own (localized) toast on success or failure, so the page
 * needs no new strings. Returns false only when not running natively.
 */
export async function saveFileNative(
  name: string,
  mime: string,
  bytes: Uint8Array,
): Promise<boolean> {
  const plugin = native();
  if (!plugin) return false;
  try {
    await plugin.saveOpen({ name, mime: mime || "application/octet-stream" });
    for (let offset = 0; offset < bytes.length; offset += CHUNK_BYTES) {
      await plugin.saveAppend({ data: toBase64(bytes.subarray(offset, offset + CHUNK_BYTES)) });
    }
    await plugin.saveClose();
  } catch {
    await plugin.saveAbort().catch(() => undefined);
  }
  return true;
}

/** Sender: lit-up screen the whole time a stream is on, back to the user's own
 *  brightness afterwards. A dim sender is the commonest reason a receiver
 *  cannot lock on. */
export function setSenderAwake(on: boolean): void {
  const plugin = native();
  if (!plugin) return;
  void plugin.setBrightness({ level: on ? 1 : -1 }).catch(() => undefined);
  void plugin.keepAwake({ on }).catch(() => undefined);
}

/** Pull a pending Share-sheet payload into File/text form, then release it. */
export async function takeShared(): Promise<
  { file: File } | { text: string } | null
> {
  const plugin = native();
  if (!plugin) return null;
  const { share } = await plugin.getPendingShare({ consume: true });
  if (!share) return null;
  if (share.kind === "text") return { text: share.text };
  const parts: Uint8Array[] = [];
  for (let offset = 0; offset < share.size; offset += CHUNK_BYTES) {
    const { data } = await plugin.readSharedChunk({
      offset,
      length: Math.min(CHUNK_BYTES, share.size - offset),
    });
    parts.push(fromBase64(data));
  }
  await plugin.finishShare().catch(() => undefined);
  return { file: new File(parts as BlobPart[], share.name, { type: share.mime }) };
}

/**
 * Run `onShare` whenever the app receives something from the Share sheet,
 * including a share that launched the app before this page loaded. The
 * listener is registered BEFORE the first check, so a copy that finishes in
 * between is delivered by one path or the other, never neither.
 *
 * `peek` only reports that something is waiting (no consume) — pages that
 * are not the sender use it to hand over to the sender page.
 */
export async function watchShare(onShare: () => void): Promise<void> {
  const plugin = native();
  if (!plugin) return;
  await plugin.addListener("shareReceived", onShare).catch(() => undefined);
  const { share } = await plugin.getPendingShare({ consume: false }).catch(() => ({ share: null }));
  if (share) onShare();
}
