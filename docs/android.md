# Android app

The Android app is the web build (`dist/`) inside a Capacitor WebView, plus one
small native plugin (`android/.../DecimenNativePlugin.java`) for the three things a
WebView cannot do:

| Need | Why the web build can't | Native side |
|---|---|---|
| Save the received file | the WebView ignores `<a download>` on blob URLs | writes to `Downloads/Decimen` (MediaStore), shows a toast |
| Send from the Share sheet | no way to register as a share target | `ACTION_SEND` file / text → the sender page |
| Bright, awake sender | no brightness API | window brightness 100 % + keep-screen-on while streaming |

Everything is bridged in `shared/native.ts`, which is inert on the web, the PWA
and the standalone HTML files. The fountain code, the WASM decoder and the
protocol are untouched, so Android and the browser stay wire-compatible.

The app declares **no INTERNET permission** (only CAMERA). That is deliberate:
the OS then guarantees the app cannot send anything over a network.

## Build

CI (`.github/workflows/android.yml`) builds an APK on every push and attaches it
to tagged releases. Locally (JDK 21 and the Android SDK required):

```
npm ci
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Signing (needed for updates)

Without secrets CI produces a **debug-signed** APK: it installs, but cannot be
updated over a copy signed with a different key. For a release people keep:

```
keytool -genkey -v -keystore release.jks -alias decimen -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.jks     # paste into the secret below
```

Repository secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. **Back the keystore up** — losing
it means users must uninstall to update. Never commit it.

## Not yet verified

Written without an Android SDK to compile against; the first CI run is the
first compile. Check on a real phone: camera permission prompt, a transfer in
each direction, Save, and a Share-sheet send.
