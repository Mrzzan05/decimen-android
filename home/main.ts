// Home page script: init the locale layer, then wire the share dialog.
import { initI18n } from "../shared/i18n";
import { wireShareDialog } from "../shared/share-dialog";
import { watchShare } from "../shared/native";

await initI18n();

document.getElementById("share-open")!.addEventListener("click", wireShareDialog());

// Android app: something shared into Decimen from another app lands here first.
// Hand it to the sender page, which turns it into a running stream.
void watchShare(() => {
  location.href = "send/";
});
