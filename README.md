# Japhe Farm — Onion Tracker

A phone-first onion farming tracker: crop age, activity log (fertilizer, weeding,
spraying, mulching, irrigation), field observations, and season history.
No backend, no build step — a static PWA that runs entirely in the browser
and saves data on your phone (localStorage).

## Files

- `index.html` — the entire app
- `manifest.json` — makes it installable ("Add to Home Screen")
- `sw.js` — service worker, caches the app so it works offline after first load
- `icon-192.png`, `icon-512.png` — app icons

## Deploying to GitHub Pages

1. Create a new repository on GitHub (or use an existing one).
2. Upload all five files in this folder to the repository root — on your
   phone, the GitHub app or the mobile site's "Add file → Upload files" works
   fine for this.
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the branch (usually `main`) and folder `/ (root)`, then **Save**.
5. GitHub will give you a URL like `https://<your-username>.github.io/<repo-name>/`
   — that's your live app. It can take a minute or two to go live the first time.
6. Open that URL in Chrome on your phone, then use the menu (⋮) →
   **Add to Home screen** to install it like a normal app.

## Updating the app later

Whenever you upload a new version of `index.html` (or any file), GitHub Pages
redeploys automatically. If you change `index.html` and want visitors to get
the update quickly rather than waiting for the background refresh, bump the
version number in `sw.js`:

```js
const CACHE_NAME = "japhe-farm-v1"; // change to v2, v3, etc.
```

That forces the service worker to treat everything as new and re-cache it.

## Offline behaviour

- First visit needs an internet connection (to download the app and the
  React library it uses from a CDN).
- After that first successful visit, the app — including React itself —
  is cached and works with no internet connection at all.
- Your farm data (events, observations, farm name) is saved locally on your
  phone via `localStorage` and never leaves the device — it isn't part of
  what the service worker caches, and isn't uploaded anywhere.
