package io.github.mrzzan05.opticaltransfer;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;

/**
 * The three things the web page cannot do inside an Android WebView:
 * save a received file, accept the Share sheet, and light up the screen.
 *
 * File bytes cross the bridge as base64 chunks (see shared/native.ts), so no
 * single call carries more than a few hundred KB.
 */
@CapacitorPlugin(name = "DecimenNative")
public class DecimenNativePlugin extends Plugin {

    // ---- save (received file -> Downloads/Decimen) --------------------

    private final Object saveLock = new Object();
    private OutputStream saveStream;
    private Uri saveUri;        // API 29+: the pending MediaStore row
    private File saveFile;      // API 24-28: app-specific external dir
    private String saveName;

    @PluginMethod
    public void saveOpen(PluginCall call) {
        String name = safeName(call.getString("name", "received-file"));
        String mime = call.getString("mime", "application/octet-stream");
        synchronized (saveLock) {
            abortLocked();
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentResolver resolver = getContext().getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH,
                            Environment.DIRECTORY_DOWNLOADS + "/Decimen");
                    values.put(MediaStore.MediaColumns.IS_PENDING, 1);
                    saveUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (saveUri == null) throw new IOException("MediaStore insert failed");
                    saveStream = resolver.openOutputStream(saveUri);
                    if (saveStream == null) throw new IOException("no output stream");
                } else {
                    // Below Android 10 a public Downloads write needs a storage
                    // permission; the app's own external folder needs none.
                    File dir = new File(getContext().getExternalFilesDir(null), "Decimen");
                    if (!dir.exists() && !dir.mkdirs()) throw new IOException("cannot create " + dir);
                    saveFile = uniqueFile(dir, name);
                    saveStream = new FileOutputStream(saveFile);
                }
                saveName = name;
                call.resolve();
            } catch (Exception e) {
                abortLocked();
                toast(R.string.save_failed);
                call.reject("save open failed: " + e.getMessage());
            }
        }
    }

    @PluginMethod
    public void saveAppend(PluginCall call) {
        String data = call.getString("data");
        synchronized (saveLock) {
            if (saveStream == null || data == null) {
                call.reject("no save in progress");
                return;
            }
            try {
                saveStream.write(Base64.decode(data, Base64.NO_WRAP));
                call.resolve();
            } catch (Exception e) {
                abortLocked();
                toast(R.string.save_failed);
                call.reject("save write failed: " + e.getMessage());
            }
        }
    }

    @PluginMethod
    public void saveClose(PluginCall call) {
        synchronized (saveLock) {
            if (saveStream == null) {
                call.reject("no save in progress");
                return;
            }
            try {
                saveStream.close();
                saveStream = null;
                String location;
                if (saveUri != null) {
                    ContentValues done = new ContentValues();
                    done.put(MediaStore.MediaColumns.IS_PENDING, 0);
                    getContext().getContentResolver().update(saveUri, done, null, null);
                    location = Environment.DIRECTORY_DOWNLOADS + "/Decimen/" + saveName;
                } else {
                    location = saveFile.getAbsolutePath();
                }
                saveUri = null;
                saveFile = null;
                toast(R.string.saved_to_downloads);
                JSObject result = new JSObject();
                result.put("location", location);
                call.resolve(result);
            } catch (Exception e) {
                abortLocked();
                toast(R.string.save_failed);
                call.reject("save close failed: " + e.getMessage());
            }
        }
    }

    @PluginMethod
    public void saveAbort(PluginCall call) {
        synchronized (saveLock) {
            abortLocked();
        }
        call.resolve();
    }

    /** Close and discard a half-written file. Caller holds saveLock. */
    private void abortLocked() {
        try {
            if (saveStream != null) saveStream.close();
        } catch (IOException ignored) {
            // already failing; nothing more to do
        }
        saveStream = null;
        if (saveUri != null) {
            try {
                getContext().getContentResolver().delete(saveUri, null, null);
            } catch (Exception ignored) {
                // best effort
            }
            saveUri = null;
        }
        if (saveFile != null) {
            //noinspection ResultOfMethodCallIgnored
            saveFile.delete();
            saveFile = null;
        }
    }

    private static String safeName(String name) {
        String cleaned = name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        if (cleaned.isEmpty() || cleaned.equals(".") || cleaned.equals("..")) return "received-file";
        return cleaned.length() > 120 ? cleaned.substring(cleaned.length() - 120) : cleaned;
    }

    private static File uniqueFile(File dir, String name) {
        File candidate = new File(dir, name);
        int n = 1;
        int dot = name.lastIndexOf('.');
        String stem = dot > 0 ? name.substring(0, dot) : name;
        String ext = dot > 0 ? name.substring(dot) : "";
        while (candidate.exists()) {
            candidate = new File(dir, stem + " (" + n++ + ")" + ext);
        }
        return candidate;
    }

    private void toast(int resId) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(
                () -> Toast.makeText(getContext(), resId, Toast.LENGTH_LONG).show());
    }

    // ---- screen (sender brightness + keep awake) ----------------------

    @PluginMethod
    public void setBrightness(PluginCall call) {
        final float level = call.getDouble("level", -1.0).floatValue();
        if (getActivity() == null) {
            call.resolve();
            return;
        }
        getActivity().runOnUiThread(() -> {
            Window window = getActivity().getWindow();
            WindowManager.LayoutParams params = window.getAttributes();
            // -1 = BRIGHTNESS_OVERRIDE_NONE: hand control back to the system.
            params.screenBrightness = level < 0 ? WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
                    : Math.min(1f, level);
            window.setAttributes(params);
            call.resolve();
        });
    }

    @PluginMethod
    public void keepAwake(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        if (getActivity() == null) {
            call.resolve();
            return;
        }
        getActivity().runOnUiThread(() -> {
            Window window = getActivity().getWindow();
            if (on) {
                window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            } else {
                window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
            call.resolve();
        });
    }

    // ---- Share sheet intake -------------------------------------------

    private final Object shareLock = new Object();
    private File sharedFile;
    private String sharedName;
    private String sharedMime;
    private long sharedSize;
    private String sharedText;
    private boolean sharedReady;

    @Override
    public void load() {
        if (getActivity() != null) ingest(getActivity().getIntent());
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        ingest(intent);
    }

    /** Copy a shared stream into the app cache off the main thread, then tell the page. */
    private void ingest(Intent intent) {
        if (intent == null || !Intent.ACTION_SEND.equals(intent.getAction())) return;
        final String type = intent.getType();
        @SuppressWarnings("deprecation")
        final Uri stream = Build.VERSION.SDK_INT >= 33
                ? intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri.class)
                : (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
        final CharSequence text = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
        if (stream == null && text == null) return;
        // The Intent is consumed: a later activity recreate must not replay it.
        intent.setAction(Intent.ACTION_MAIN);

        new Thread(() -> {
            try {
                synchronized (shareLock) {
                    clearSharedLocked();
                    if (stream != null) {
                        copyShared(stream, type);
                    } else {
                        sharedText = text.toString();
                    }
                    sharedReady = true;
                }
                notifyListeners("shareReceived", new JSObject());
            } catch (Exception e) {
                synchronized (shareLock) {
                    clearSharedLocked();
                }
            }
        }, "decimen-share-ingest").start();
    }

    private void copyShared(Uri uri, String type) throws IOException {
        ContentResolver resolver = getContext().getContentResolver();
        String name = "shared-file";
        try (Cursor cursor = resolver.query(uri, new String[]{OpenableColumns.DISPLAY_NAME},
                null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                String display = cursor.getString(0);
                if (display != null && !display.isEmpty()) name = safeName(display);
            }
        } catch (Exception ignored) {
            // fall back to the generic name
        }
        File dir = new File(getContext().getCacheDir(), "shared");
        if (!dir.exists() && !dir.mkdirs()) throw new IOException("cannot create " + dir);
        File target = new File(dir, "incoming.bin");
        long total = 0;
        try (InputStream in = resolver.openInputStream(uri);
             OutputStream out = new FileOutputStream(target)) {
            if (in == null) throw new IOException("cannot open shared stream");
            byte[] buffer = new byte[64 * 1024];
            int read;
            while ((read = in.read(buffer)) > 0) {
                out.write(buffer, 0, read);
                total += read;
            }
        }
        String mime = resolver.getType(uri);
        sharedFile = target;
        sharedName = name;
        sharedMime = mime != null ? mime : (type != null ? type : "application/octet-stream");
        sharedSize = total;
    }

    private void clearSharedLocked() {
        if (sharedFile != null) {
            //noinspection ResultOfMethodCallIgnored
            sharedFile.delete();
        }
        sharedFile = null;
        sharedName = null;
        sharedMime = null;
        sharedSize = 0;
        sharedText = null;
        sharedReady = false;
    }

    /** consume=false only reports that something is waiting (used by the home page). */
    @PluginMethod
    public void getPendingShare(PluginCall call) {
        boolean consume = Boolean.TRUE.equals(call.getBoolean("consume", true));
        JSObject result = new JSObject();
        synchronized (shareLock) {
            if (!sharedReady) {
                result.put("share", JSObject.NULL);
            } else if (sharedText != null) {
                JSObject share = new JSObject();
                share.put("kind", "text");
                share.put("text", sharedText);
                result.put("share", share);
                if (consume) clearSharedLocked();
            } else {
                JSObject share = new JSObject();
                share.put("kind", "file");
                share.put("name", sharedName);
                share.put("mime", sharedMime);
                share.put("size", sharedSize);
                result.put("share", share);
                // A file stays until finishShare(): the page reads it in chunks.
            }
        }
        call.resolve(result);
    }

    @PluginMethod
    public void readSharedChunk(PluginCall call) {
        long offset = call.getLong("offset", 0L);
        int length = call.getInt("length", 0);
        synchronized (shareLock) {
            if (sharedFile == null || length <= 0 || length > 4 * 1024 * 1024) {
                call.reject("no shared file");
                return;
            }
            try (RandomAccessFile file = new RandomAccessFile(sharedFile, "r")) {
                file.seek(offset);
                byte[] buffer = new byte[length];
                int got = 0;
                while (got < length) {
                    int n = file.read(buffer, got, length - got);
                    if (n < 0) break;
                    got += n;
                }
                JSObject result = new JSObject();
                result.put("data", Base64.encodeToString(buffer, 0, got, Base64.NO_WRAP));
                call.resolve(result);
            } catch (IOException e) {
                call.reject("read failed: " + e.getMessage());
            }
        }
    }

    @PluginMethod
    public void finishShare(PluginCall call) {
        synchronized (shareLock) {
            clearSharedLocked();
        }
        call.resolve();
    }
}
