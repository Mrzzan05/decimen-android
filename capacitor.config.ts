import type { CapacitorConfig } from "@capacitor/cli";

// Android shell around the web build in dist/. The app is served from
// https://localhost inside the WebView (a secure context), which is what
// getUserMedia needs — no network and no certificate involved.
const config: CapacitorConfig = {
  appId: "io.github.mrzzan05.opticaltransfer",
  appName: "Decimen",
  webDir: "dist",
  android: {
    // Never let the app be reached through anything but the bundled files.
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
