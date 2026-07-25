# ApratimTab

A premium, customizable New Tab dashboard for Chrome and the web. Replace your boring New Tab page with a beautiful, glassmorphic workspace: app launcher, smart search, notes, todos, weather, calculator, bookmarks, clipboard history, and more — all built around your own wallpaper and categories.

Built by **Ashutosh Palhare**.

![ApratimTab](public/icon.png)

## Features

- **Category-based app launcher** — organize your apps, links, and tools into custom categories.
- **Glassmorphic dashboard** — premium dark theme with a customizable live wallpaper, glass dock, and smooth transitions.
- **Smart universal search** — search apps, notes, todos, Chrome history and bookmarks from one panel.
- **Productivity widgets** — Notes, Todos, Calculator, Weather (OpenWeatherMap), and Favorites.
- **Browser tools** — Recent Tabs/History, Bookmarks, and Clipboard manager.
- **Profile & settings** — profile panel, wallpaper sources, weather config, and About section.
- **Chrome extension ready** — packaged as a Manifest V3 extension with `chrome.storage` sync; also works as a normal web app with localStorage fallback.

## Demo / Live preview

The project is a TanStack Start app. The same code runs both as the live preview site and as the Chrome extension packaged in `public/apratimtab.zip`.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, Vite 7)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) — state management
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- Chrome Extension Manifest V3

## Project structure

```
/dev-server
├── src/
│   ├── components/
│   │   └── ApratimTab.tsx          # Main dashboard shell
│   ├── features/
│   │   ├── apps/                   # App grid & Add app dialog
│   │   ├── dock/                   # Bottom glass dock & panels
│   │   ├── panels/                 # Lazy-loaded utility panels
│   │   ├── sidebar/                # Category sidebar
│   │   ├── wallpaper/              # Wallpaper rendering & providers
│   │   ├── profile/                # Profile side panel
│   │   └── settings/               # Settings panel
│   ├── ext/
│   │   ├── chromeApis.ts           # Chrome API guards (history, bookmarks, tabs)
│   │   └── storage.ts              # Chrome storage / localStorage adapter
│   ├── stores/
│   │   └── useApratimStore.ts      # Zustand store (apps, categories, notes, todos, settings, profile)
│   ├── styles.css                  # Tailwind v4 theme & design tokens
│   └── routes/                     # TanStack Start routes
│       └── index.tsx               # Home route
├── extension/
│   ├── manifest.json               # Manifest V3
│   ├── background.js               # Service worker
│   ├── newtab.html                 # New Tab page wrapper
│   └── icon.png                    # Extension icon
├── public/
│   ├── apratimtab.zip              # Packaged extension (download from preview)
│   └── icon.png
├── package.json
├── tsconfig.json
└── README.md
```

## Getting started

### Local development

Requires [Node.js](https://nodejs.org/) (v20+) and [Bun](https://bun.sh/) (recommended).

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

Open `http://localhost:8080` in your browser.

### Build for production

```sh
bun run build
```

## Chrome extension installation

1. Download the packaged extension: click the **Download ApratimTab Extension** button in the live preview, or use the file in `public/apratimtab.zip`.
2. Unzip the downloaded file.
3. Open Chrome (or any Chromium browser like Edge, Brave, Arc, Opera) and navigate to `chrome://extensions`.
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** and select the unzipped `extension` folder.
6. Open a new tab — ApratimTab should now appear as your New Tab page.

## Configuration

### Weather

Open the **Settings** panel, then enable **Weather** and enter your [OpenWeatherMap](https://openweathermap.org/api) API key.

### Wallpaper

Choose between a local file upload, a direct image URL, or external sources (Unsplash / Pexels) via the Wallpaper provider system.

## Customization

All design tokens (colors, spacing, shadows) live in `src/styles.css` and are used through Tailwind v4 theme variables. No hardcoded colors are used in components, so the theme is easy to extend or switch to a light mode.

## Data storage

- **Chrome extension**: data is saved in `chrome.storage.local` via the storage adapter in `src/ext/storage.ts`.
- **Web preview**: `localStorage` is used automatically when the Chrome APIs are unavailable.

## Author

- **Ashutosh Palhare** — Developer

## License

This project was built with [Lovable](https://lovable.dev). The code is yours to extend, deploy, and publish.

## Roadmap / ideas

- Light mode theme
- Calendar / clock widget
- Pomodoro timer
- More wallpaper providers (Bing, NASA, etc.)
- Cloud sync for settings across devices
- Custom CSS injection

---

Enjoy your new tab! If you have feedback or ideas, drop a message in the project.
