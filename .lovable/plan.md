# ApratimTab — Build Plan

A brand-new Chrome MV3 new-tab extension. No HiTab code exists here, so nothing to migrate. I'll build it fresh, packaged as a downloadable `.zip`, with a live Vite preview of the new-tab UI for fast iteration.

## Deliverables

1. `extension/` — MV3 extension source (manifest, background service worker, new-tab HTML/JS/CSS, icons).
2. `src/routes/index.tsx` — same UI mounted in the Lovable preview so you can see it live.
3. `public/apratimtab.zip` — packaged unpacked-load bundle, with in-app download button + install steps.

## Feature scope (v1)

**Shell**
- Sidebar: Home, Recent Apps, Google Apps, AI Tools, Coding, Entertainment, Social Media, Games, Shopping, Online Tools + custom categories (CRUD + reorder via dnd-kit).
- Responsive app grid per category with favicon fallback.
- Floating glass bottom dock: Recent Apps, Universal Search, Bookmarks, History, Notes, Todo, Calculator, Favorites, Clipboard (opt), Weather (opt). Panels lazy-loaded.
- Profile side panel: picture, name, mobile, bio, social handles, inline edit.
- Settings: wallpaper (local upload / URL / Unsplash / Pexels providers via pluggable interface) + blur / brightness / overlay opacity; OpenWeatherMap key field.
- About: Ashutosh Palhare, version, contact, GitHub, website, privacy, changelog.

**Data**
- `chrome.storage.sync`: settings, profile, categories, favorites, theme.
- `chrome.storage.local`: notes, recent apps, wallpaper cache, clipboard.
- In web preview: a thin adapter falls back to `localStorage` so the same code runs in both environments.
- Chrome APIs used only when present: bookmarks, history, tabs, favicon. Universal Search fans out across apps + bookmarks + history + notes + todos with grouped results.

**Add App form** (replaces store): name, URL, icon upload/URL, category, favorite toggle, save → written into the selected category.

**Stack**: React + TS + Vite + Tailwind v4 + shadcn/ui + Framer Motion + Zustand + React Hook Form + Zod + Lucide. Strict TS, lazy panels, memoized grids.

## Folder layout

```text
extension/
  manifest.json
  background.js
  newtab.html            # built from src via vite (multi-entry)
  icons/{16,48,128}.png
src/
  ext/
    storage.ts           # chrome.storage <-> localStorage adapter
    chromeApis.ts        # bookmarks/history/tabs guards
  features/
    sidebar/             # categories, custom CRUD, reorder
    dock/                # lazy panels: search, notes, todo, calc, weather, ...
    apps/                # AppGrid, AddAppDialog, favicon
    profile/             # ProfilePanel + inline edit
    settings/            # wallpaper providers (unsplash, pexels, local, url)
    about/
    wallpaper/providers/ # extensible provider registry
  stores/                # zustand slices: apps, categories, profile, ui, wallpaper
  routes/index.tsx       # mounts <NewTab /> for preview
  components/ui/         # shadcn primitives (only what's used)
```

## Packaging

Build the extension with a second Vite config that emits `newtab.html` + assets into `extension/dist/`, then zip:

```text
nix run nixpkgs#zip -- -r public/apratimtab.zip extension
```

Preview shows a "Download extension" button using the fetch+blob pattern + Load-unpacked instructions.

## Out of scope for v1

- Sign-in / auth / widget store / app store — explicitly removed as requested.
- Cross-device sync beyond `chrome.storage.sync` limits.
- Publishing to Chrome Web Store (you download the zip yourself).

## What I need from you before coding

1. **OpenWeatherMap API key** — I'll wire the input into Settings; you paste it there at runtime (not stored in code). OK?
2. **Unsplash / Pexels keys** — same: entered in Settings, stored in `chrome.storage.sync`. OK?
3. **Design direction** — do you want a specific look (screenshot, brand ref, colors), or should I pick a premium dark-glass default (deep neutral + single accent, SF-like sans, heavy blur, soft shadows)?
4. **Icons/logo** — should I generate an ApratimTab wordmark + icon set, or will you provide?

Reply and I'll start with the shell (manifest, storage adapter, sidebar, grid, dock scaffold) in the first pass, then layer features incrementally.