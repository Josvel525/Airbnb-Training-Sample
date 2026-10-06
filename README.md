# Airbnb UI — GitHub Pages web app

This package contains the updated five-page interface, full-width viewport layout,
compact bottom navigation, fixed page headers, scrolling content, and Home Screen
installation files. The Profile title collapses as its content scrolls.

## Publish on GitHub Pages

1. Unzip this package. Upload its **contents** to the root of your repository:
   `index.html`, `manifest.webmanifest`, `sw.js`, the entire `icons` folder, and
   `.nojekyll`. Do not upload only the ZIP or place everything in another nested folder.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select your publishing branch (usually `main`)
   and **/(root)**, then save.
4. After deployment finishes, open the **HTTPS website URL shown in Pages settings**.
   A project site normally looks like `https://YOUR-NAME.github.io/YOUR-REPOSITORY/`.
   Use the published site, not GitHub's file viewer or a raw-file URL.

All app URLs are relative, so the same files also work at a custom domain or a
`YOUR-NAME.github.io` root site. No build command or package installation is needed.

## Add it to an iPhone Home Screen

1. Open the published HTTPS site in Safari.
2. Tap **Share → Add to Home Screen**. Depending on your Safari layout, Share may
   be inside the page menu.
3. Turn on **Open as Web App** if that option is shown, then tap **Add**.
4. Launch the new **Airbnb UI** icon from the Home Screen.

Launching the installed app removes Safari's address bar and toolbar. Simply hosting
the page on GitHub does not remove those bars in a regular browser tab. iOS still
controls its status bar, camera cutout, and Home indicator. The app background fills
the available viewport and keeps controls inside the safe areas.

If an older shortcut keeps the old icon or opens in Safari, remove that shortcut
and add the updated site again after deployment completes.

On Android, open the published site in Chrome and use **Install app** or
**Add to Home screen** from the browser menu.

## Files you can edit

- `index.html`: all page markup, shared CSS, tab navigation and interactions.
- `manifest.webmanifest`: app name, installed launch mode, scope and icon paths.
- `icons/icon.svg`: editable Airbnb-style white outline on a coral background.
- `icons/apple-touch-icon.png`: 180×180 Home Screen icon for iPhone/iPad.
- `icons/icon-192.png` and `icons/icon-512.png`: app icons for other browsers.
- `sw.js`: app-shell and viewed-image/font caching. Increment `VERSION` when
  publishing changes so the installed app refreshes its cached assets.

The SVG is the source icon (SVG, not CSV). PNG copies are included for Home Screen
compatibility; if you change the SVG, export updated PNGs at the sizes above too.
The operating system rounds the corners. The 512px image also has space for Android's
maskable icon crop.

## Layout and offline behavior

The app uses `width:100%`, `height:100dvh` with a `100vh` fallback, and no 430px
width cap. The body cannot scroll. Each active page contains its own scroll area,
with a separate 62px bottom navigation row plus the device's bottom safe area.
There is no fixed extra white spacer below the navigation.

All pages use the same Nunito Sans font and fallback stack. The app caches the
HTML and icons after its first successful online load. Viewed photos and loaded
fonts can be reused offline after the service worker takes control; images not
previously cached still need a connection. Browser storage eviction can remove caches.
The photos and Google Fonts remain hosted at the URLs in the supplied code.

This is an interface demo. Installing it does not connect its screens to an Airbnb
account or add live bookings, messaging, account editing or push notifications.

To preview locally, run `python3 -m http.server 8080` in this folder and open
`http://localhost:8080/`. Opening `index.html` directly previews the UI but cannot
activate the service worker. Installation and real device safe areas must be checked
on the published site; they cannot be demonstrated by opening a downloaded HTML file.

References:

- [GitHub Pages publishing setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Apple: turn a website into an app](https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios)
- [MDN: standalone web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app)
