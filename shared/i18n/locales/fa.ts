// Persian (فارسی) — RTL.
// Machine-drafted (Claude), not yet reviewed by a native speaker.
// When a native review lands, flip `reviewed: true` for "fa" in
// shared/i18n/registry.ts to remove the on-page unreviewed note.

import type { Messages } from "../messages";
import { localeByCode } from "../registry";

export const messages: Messages = {
  meta: localeByCode("fa")!,

  chrome: {
    navAriaLabel: "حالت",
    navSend: "ارسال",
    navReceive: "دریافت",
    modeBadgeSend: "ارسال",
    modeBadgeReceive: "دریافت",
    footerLinksAriaLabel: "پیوندهای پروژه",
    footerSupport: "♥ حمایت",
  },

  home: {
    title: "Decimen Optical Transfer — انتقال فایل با نور",
    metaDescription:
      "فایل یا متن را فقط با یک صفحه‌نمایش و یک دوربین بین دو دستگاه بفرستید. کدهای QR متحرک با کدگذاری فواره‌ای، بدون هیچ مسیر شبکه‌ای میان دو دستگاه.",
    ogDescription:
      "کدهای QR متحرک با کدگذاری فواره‌ای، از صفحه‌نمایش به دوربین. بدون حساب کاربری، بدون جفت‌سازی و بدون مسیر شبکه‌ای میان دو دستگاه. %TOP_SPEED% پایدار، همراه با مستندات اندازه‌گیری.",
    ogImageAlt: "گوشی‌ای در حال انتقال که جریان QR متحرک را از صفحه‌نمایش دستگاه دیگر می‌خواند.",
    heroTitleHtml: "انتقال فایل<br />با نور.",
    heroCopy:
      "فایل یا متن را از یک صفحه‌نمایش به دوربین دستگاه دیگر بفرستید. بدون حساب کاربری، جفت‌سازی، ذخیره‌سازی ابری یا مسیر شبکه‌ای میان دستگاه‌ها.",
    chooseSideAriaLabel: "یک سمت را انتخاب کنید",
    cardSendKicker: "این صفحه‌نمایش ارسال می‌کند",
    cardSendTitle: "ارسال فایل یا متن",
    cardSendBody:
      "هر فایلی تا %MAX_FILE_LABEL%، یا یک متن چسبانده‌شده تا %MAX_SNIPPET_LABEL%. در صورت سودمندی فشرده می‌شود و با نام اصلی بازیابی می‌شود.",
    cardSendAction: "ارسال",
    cardReceiveKicker: "این دوربین دریافت می‌کند",
    cardReceiveTitle: "نشانه بگیرید و دریافت کنید",
    cardReceiveBody: "دوربین را روی صفحه‌نمایش فرستنده بگیرید تا فایل دریافت شود.",
    cardReceiveAction: "دریافت",
    shareSite: "اشتراک‌گذاری Decimen",
    supportTitle: "رایگان، متن‌باز، بدون تبلیغ",
    supportBodyHtml:
      'اگر Decimen کارتان را راحت‌تر کرد، می‌توانید <a href="https://buymeacoffee.com/bashalarmist" target="_blank" rel="noopener noreferrer">یک قهوه مهمانم کنید</a>.',
    shareDialogTitle: "اشتراک‌گذاری این برنامه",
    shareDialogHint: "این را با دوربین دستگاه دیگر اسکن کنید، یا پیوند را برایش بفرستید.",
    siteLinkAriaLabel: "پیوند سایت",
    privacyNote:
      "نیازی به مسیر شبکه‌ای میان دستگاه‌ها نیست. بایت‌ها به شکل نور منتقل می‌شوند. فایل‌ها رمزنگاری نمی‌شوند، پس هر چیزی که روی صفحه‌نمایش فرستنده است برای هر دوربینی که به آن نگاه کند قابل‌خواندن است.",
  },

  send: {
    docTitle: "Decimen Optical Transfer — ارسال",
    eyebrow: "صفحه‌نمایش ← دوربین",
    introCopy: "تا وقتی با یک گیرنده اسکن نکنید، چیزی از دستگاه شما خارج نمی‌شود.",
    modeAriaLabel: "چه چیزی ارسال شود",
    modeFile: "فایل",
    modeSnippet: "متن کوتاه",
    titleFile: "ارسال فایل",
    titleSnippet: "ارسال متن",
    selectFile: "انتخاب فایل",
    stopTransfer: "توقف انتقال",
    anyFileUpTo: "هر فایلی · تا %MAX_FILE_LABEL%",
    selectedFile: (name) => `فایل انتخاب‌شده: ${name}`,
    demoPayload: "داده نمایشی",
    benchmarkPayload: "داده محک سرعت",
    demo512: "تصویر ۵۱۲ کیلوبایتی",
    demo2mb: "تصویر ۲ مگابایتی",
    demoBenchmark: "محک ۱ مگابایتی",
    navDemo: "نمایشی",
    navBenchmark: "محک",
    snippetLabel: "متن برای ارسال",
    snippetLabelWithMax: "متن برای ارسال · تا %MAX_SNIPPET_LABEL%",
    snippetPlaceholder: "هر چیزی را بچسبانید یا تایپ کنید — یک نشانی، یک پیکربندی، یک متن بلند…",
    startTextStream: "شروع ارسال متن",
    settingsSummary: "تنظیمات انتقال",
    settingTxFps: "نرخ فریم ارسال",
    settingBytesPerFrame: "بایت در هر فریم",
    settingEcc: "تصحیح خطا",
    settingLayout: "چیدمان",
    layout1: "۱ کد",
    layout2: "۲ کد (۱×۲)",
    layout4: "۴ کد (۲×۲)",
    layout6: "۶ کد (۲×۳)",
    settingDisplaySize: "اندازه نمایش",
    specTxRate: "نرخ ارسال",
    specFramePayload: "بار هر فریم",
    specQr: "QR",
    specSending: "در حال ارسال",
    specCompression: "فشرده‌سازی",
    specFountainBlocks: "بلوک‌های فواره‌ای",
    statusChooseFile: "برای شروع یک فایل انتخاب کنید",
    statusPasteText: "برای شروع کمی متن بچسبانید یا تایپ کنید",
    statusChooseDemo: "برای شروع یک داده نمایشی انتخاب کنید",
    statusBenchmark: "برای شروع، داده محک را ارسال کنید",
    footerHint: "در دستگاه دیگر بخش دریافت را باز کنید. روشنایی این صفحه را بالا ببرید.",
    footerHintStandalone:
      "در دستگاه دیگر گیرنده مستقل را باز کنید. روشنایی این صفحه را بالا ببرید.",
    shareDialogTitle: "اشتراک‌گذاری گیرنده",
    shareDialogHint: "این را با دوربین دستگاه دیگر اسکن کنید، یا پیوند را برایش بفرستید.",
    receiverLinkAriaLabel: "پیوند گیرنده",
    shareTitleData: "Decimen Optical Transfer — گیرنده",
    loadingDemo: (name) => `در حال بارگذاری ${name}…`,
    demoLoadFailed: (name, status) => `بارگذاری ${name} ممکن نشد (${status})`,
    preparingFile: (name) => `در حال آماده‌سازی ${name}…`,
    preparingSnippet: "در حال آماده‌سازی متن…",
    fileEmpty: (name) => `${name} خالی است — چیزی برای ارسال وجود ندارد.`,
    fileOverLimit: (name, size, limit) => `${name} حجمی برابر ${size} دارد و از حد ${limit} بیشتر است.`,
    capacityError: (size, blocks, frameBytes, maxBlocks, suggestion) =>
      `${size} با ${frameBytes} بایت در هر فریم به ${blocks} بلوک نیاز دارد، ولی هر فریم فقط ` +
      `می‌تواند ${maxBlocks} بلوک را شماره‌گذاری کند. بایت در هر فریم را به ${suggestion} یا بیشتر برسانید.`,
    streaming: (name) => `در حال ارسال ${name} — `,
    shareReceiverLink: "اشتراک‌گذاری پیوند گیرنده",
    stallWarning: (seconds) =>
      `جریان ارسال ${seconds} ثانیه متوقف شد — این پنجره پنهان یا در پس‌زمینه بود. ` +
      `آن را قابل‌مشاهده و فعال نگه دارید؛ با توقف آن، گیرنده قفل خود را از دست می‌دهد.`,
    fpsValue: (fps, codes) => (codes > 1 ? `${fps} فریم/ثانیه × ${codes} کد` : `${fps} فریم/ثانیه`),
    frameBytesValue: (bytes, codes) =>
      codes > 1 ? `${bytes} بایت × ${codes}` : `${bytes} بایت`,
    gzipTo: (size) => `gzip ← ${size}`,
    compressionNone: "ندارد",
    exportSummary: "خروجی گرفتن به شکل انیمیشن",
    exportIntro:
      "این جریان را به شکل یک فایل انیمیشن تکرارشونده ذخیره کنید. آن را در یک ویدیو یا صفحه " +
      "قرار دهید — هر دوربینی که به این حلقه در حال پخش نگاه کند می‌تواند فایل را دریافت کند.",
    exportFormat: "قالب",
    exportFormatZip: "دنباله PNG (ZIP)",
    exportFps: "نرخ فریم",
    exportScale: "مقیاس ماژول",
    exportCycles: "تعداد چرخه",
    exportStart: "خروجی گرفتن",
    exportCancel: "لغو",
    exportEstimate: (frames, size, loop) => `${frames} فریم · حدود ${size} · حلقه ${loop}`,
    exportProgress: (percent) => `در حال ساخت… ${percent}٪`,
    exportFailed: (message) => `خروجی گرفتن ناموفق بود: ${message}`,
    exportZipLimit: (frames, max) =>
      `${frames} فریم از حد ZIP یعنی ${max} بیشتر است. با چرخه کمتر، چیدمان پهن‌تر یا بایت بیشتر در هر فریم آن را کوتاه کنید.`,
  },

  receive: {
    docTitle: "Decimen Optical Transfer — دریافت",
    eyebrow: "دوربین ← دستگاه شما",
    title: "دریافت",
    statusReady: "آماده اسکن یک فایل یا جریان متن",
    startCamera: "روشن کردن دوربین",
    starting: "در حال شروع…",
    noSignalQuestion: "اتفاقی نمی‌افتد؟",
    progressZero: "۰٪ · ۰ فریم",
    estimatingTime: "در حال تخمین زمان…",
    progressAriaLabel: "پیشرفت بازیابی انتقال",
    tipsTitle: "نکته‌های رفع مشکل",
    tipDropFrameBytes: (bytes) =>
      `در فرستنده، تنظیمات انتقال را باز کنید و بایت در هر فریم را به ${bytes} کاهش دهید.`,
    tipDropTxFps: (fps) => `هنوز چیزی نیست؟ نرخ فریم ارسال فرستنده را هم به ${fps} کاهش دهید.`,
    tipFillView:
      "کد را تمام‌صفحه در دید این دوربین قرار دهید و گوشی را به چیزی تکیه دهید — " +
      "فوکوس‌کردن‌های پی‌درپی به‌خاطر لرزش دست معمولاً مقصر اصلی است.",
    tipBrightness: "روشنایی صفحه‌نمایش فرستنده را تا آخر بالا ببرید.",
    diagnosticsSummary: "عیب‌یابی زنده",
    metricCaptureFps: "نرخ فریم دوربین",
    metricDecodeFps: "نرخ فریم رمزگشایی",
    metricGoodput: "نرخ مفید",
    metricElapsed: "زمان سپری‌شده",
    metricFrames: "فریم جدید/تکراری",
    metricBlocks: "بلوک‌ها K",
    metricBlockLen: "طول بلوک",
    metricTransfer: "انتقال",
    settingsSummary: "تنظیمات دریافت",
    settingCamera: "دوربین",
    cameraAuto: "خودکار",
    cameraN: (n) => `دوربین ${n}`,
    settingCaptureWidth: "عرض تصویر",
    settingCaptureFps: "نرخ فریم دوربین",
    settingDecodeWorkers: "کارگرهای رمزگشایی",
    autoShowLabel: "نمایش خودکار فایل‌های دریافتی",
    settingsApplied: "با روشن شدن دوربین اعمال می‌شود.",
    errSecureContext:
      "دوربین به یک بستر امن نیاز دارد — برای استفاده از دوربین از دستگاه دیگر، " +
      "این صفحه باید از طریق https ارائه شود. `npm run dev` از قبل چنین است.",
    errPermissionDenied: "مجوز دوربین رد شد — آن را مجاز کنید، سپس دوباره «روشن کردن دوربین» را بزنید.",
    errCameraGone:
      "آن دوربین دیگر در دسترس نیست — دوربین را به «خودکار» برگردانید و «روشن کردن دوربین» را بزنید.",
    errCamera: (message) => `دوربین: ${message}`,
    errRestartFailed: "دوربین: پس از تغییر، راه‌اندازی دوباره ممکن نشد — «روشن کردن دوربین» را بزنید.",
    errLiveChangeRefused: "این دوربین تغییر زنده را نپذیرفت — برای اعمال، دوباره راه‌اندازی کنید",
    cameraRefusedKeptPrevious: "آن دوربین روشن نشد — دوربین قبلی حفظ شد",
    cameraSearching: (resolution) => `دوربین ${resolution} — در جست‌وجوی جریان…`,
    cameraActual: (resolution, fps, askedFps, workers) =>
      `دوربین ${resolution} با ${fps} فریم/ثانیه${askedFps === null ? "" : ` (درخواست: ${askedFps})`} · ` +
      `${workers} کارگر رمزگشایی · تغییرات فوری اعمال می‌شوند`,
    progressBlocks: (percent, solved, k) => `${percent}٪ · ${solved}/${k} بلوک`,
    framesDecoding: (frames) => `${frames} فریم · در حال رمزگشایی`,
    aboutEta: (duration, frames) => `حدود ${duration} · ${frames} فریم`,
    etaTotal: (duration) => `در مجموع ${duration}`,
    transferFailedShort: "انتقال ناموفق بود",
    transferFailedDetail:
      "از آن جریان چیز قابل‌استفاده‌ای به دست نیامد. فرستنده را دوباره راه‌اندازی کنید، سپس " +
      "دوباره اسکن کنید — یک انتقال ناقص جز وقت هزینه‌ای ندارد.",
    tryAgain: "تلاش دوباره",
    transferSummary: "خلاصه انتقال",
    transferComplete: "انتقال کامل شد!",
    recoveredFile: "۱۰۰٪ · فایل بازیابی شد",
    recoveredText: "۱۰۰٪ · متن بازیابی شد",
    textReceived: "متن دریافت شد",
    textLabel: "متن",
    fileStats: (size, seconds, rate) => `${size} در ${seconds} · ${rate}`,
    gzipDecompressed: "gzip از حالت فشرده خارج شد",
    shaVerified: "SHA-256 تأیید شد ✓",
    saveFile: (name) => `ذخیره ${name}`,
    receiveAnother: "دریافت فایل دیگر",
    showText: "نمایش متن",
    mediaImage: "تصویر",
    mediaVideo: "ویدیو",
    mediaAudio: "صوت",
    showMedia: (noun) => `نمایش ${noun}`,
    clearCache: "پاک کردن حافظه نهان Decimen",
    cacheCleared: "حافظه نهان پاک شد",
    clearCacheFailed: "پاک کردن ناموفق بود — دوباره تلاش کنید",
    receivedPreviewAlt: (name) => `پیش‌نمایش فایل دریافتی: ${name}`,
    receivedFileAriaLabel: (name) => `فایل دریافتی: ${name}`,
    supportAfter: "♥ خوشتان آمد؟ یک قهوه مهمانم کنید",
  },

  common: {
    copy: "کپی",
    copied: "کپی شد",
    copyFailed: "کپی ناموفق بود",
    close: "بستن",
    share: "اشتراک‌گذاری…",
    dismiss: "رد کردن",
    help: "راهنما",
    gotIt: "متوجه شدم",
  },

  errors: {
    fileEmpty: "یک فایل غیرخالی انتخاب کنید.",
    fileOverLimit: (limit) => `در این نسخه مرورگر، حجم فایل‌ها به ${limit} محدود است.`,
    fileNameTooLong: "نام فایل یا نوع رسانه بیش از حد طولانی است.",
    inflateOverflow: "فایل بازیابی‌شده از طول اعلام‌شده‌اش فراتر می‌رود.",
    containerTruncated: "سرایند فایل بازیابی‌شده ناقص است.",
    containerBadMagic: "سرایند فایل بازیابی‌شده نامعتبر است.",
    containerBadCompression: "فایل بازیابی‌شده از فشرده‌سازی پشتیبانی‌نشده استفاده می‌کند.",
    containerLengthMismatch: "طول فایل بازیابی‌شده با سرایندش مطابقت ندارد.",
    gzipIncomplete: "بار gzip بازیابی‌شده ناقص است.",
    gzipLengthMismatch: "طول بار gzip با سرایند فایل مطابقت ندارد.",
    decompressedLengthMismatch: "طول فایل پس از خروج از حالت فشرده با سرایندش مطابقت ندارد.",
    streamChecksumMismatch: "مجموع کنترلی جریان نوری مطابقت نداشت.",
    sha256Failed: "فایل بازیابی‌شده در راستی‌آزمایی SHA-256 ناموفق بود.",
    snippetEmpty: "پیش از ارسال، کمی متن بچسبانید یا تایپ کنید.",
    snippetOverLimit: (limit) => `حجم متن‌ها به ${limit} محدود است.`,
    snippetNotText: "این جریان یک متن کوتاه نیست.",
    snippetBadUtf8: "متن بازیابی‌شده UTF-8 معتبر نیست.",
  },

  verdicts: {
    olderSender: (version) =>
      `آن صفحه‌نمایش با قالب قدیمی‌تر Decimen (v${version}) ارسال می‌کند. دستگاه فرستنده را به‌روزرسانی کنید.`,
    newerSender: (version) =>
      `آن صفحه‌نمایش با قالب جدیدتر Decimen (v${version}) ارسال می‌کند. برای دریافت، این برنامه را به‌روزرسانی کنید.`,
    unsupportedFlags:
      "این جریان از قابلیتی از Decimen استفاده می‌کند که این نسخه نمی‌تواند بخواند. برای دریافت، این برنامه را به‌روزرسانی کنید.",
  },

  units: {
    bytes: "B",
    kilobytes: "KB",
    megabytes: "MB",
    kbPerSecond: (value) => `${value} KB/s`,
    secondsValue: (value) => `${value} ثانیه`,
    durHours: (hours) => `${hours} ساعت`,
    durMinutes: (minutes) => `${minutes} دقیقه`,
    durSeconds: (seconds) => `${seconds} ثانیه`,
  },

  i18n: {
    languageSelectLabel: "زبان",
    unreviewedNote:
      "این ترجمه به‌صورت ماشینی تهیه شده و هنوز توسط یک فارسی‌زبان بازبینی نشده است.",
    unreviewedLinkText: "گزارش مشکل ترجمه",
    switchOffer: "Decimen به فارسی در دسترس است.",
    switchAction: "مشاهده به فارسی",
  },
};
