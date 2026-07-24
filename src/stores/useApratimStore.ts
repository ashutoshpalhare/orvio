import { create } from "zustand";
import { persist, createJSONStorage, type PersistStorage } from "zustand/middleware";
import { storageGet, storageSet } from "@/ext/storage";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AppItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
  categoryId: string;
  favorite?: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  builtin?: boolean;
  order: number;
}

export interface Profile {
  name: string;
  picture?: string;
  mobile?: string;
  bio?: string;
  socials: { label: string; url: string }[];
}

export interface WallpaperSettings {
  provider: "gradient" | "local" | "url" | "unsplash" | "pexels";
  imageUrl?: string; // resolved image url
  query?: string;
  blur: number; // 0-20
  brightness: number; // 0.2 - 1.2
  overlayOpacity: number; // 0 - 0.8
}

export interface SettingsState {
  wallpaper: WallpaperSettings;
  openWeatherKey?: string;
  weatherUnits: "metric" | "imperial";
  weatherCity?: string;
  unsplashKey?: string;
  pexelsKey?: string;
  theme: "dark" | "light";
}

export interface Note {
  id: string;
  content: string;
  updatedAt: number;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface RecentApp {
  appId: string;
  visitedAt: number;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_CATEGORIES: Category[] = [
  { id: "home", name: "Home", icon: "Home", builtin: true, order: 0 },
  { id: "recent", name: "Recent Apps", icon: "Clock", builtin: true, order: 1 },
  { id: "google", name: "Google Apps", icon: "Chrome", builtin: true, order: 2 },
  { id: "ai", name: "AI Tools", icon: "Sparkles", builtin: true, order: 3 },
  { id: "coding", name: "Coding", icon: "Code2", builtin: true, order: 4 },
  { id: "entertainment", name: "Entertainment", icon: "Film", builtin: true, order: 5 },
  { id: "social", name: "Social Media", icon: "Users", builtin: true, order: 6 },
  { id: "games", name: "Games", icon: "Gamepad2", builtin: true, order: 7 },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", builtin: true, order: 8 },
  { id: "tools", name: "Online Tools", icon: "Wrench", builtin: true, order: 9 },
];

const DEFAULT_APPS: AppItem[] = [
  { id: "g1", name: "Gmail", url: "https://mail.google.com", categoryId: "google", createdAt: 0 },
  { id: "g2", name: "Drive", url: "https://drive.google.com", categoryId: "google", createdAt: 0 },
  { id: "g3", name: "Calendar", url: "https://calendar.google.com", categoryId: "google", createdAt: 0 },
  { id: "g4", name: "YouTube", url: "https://youtube.com", categoryId: "entertainment", createdAt: 0 },
  { id: "g5", name: "Maps", url: "https://maps.google.com", categoryId: "google", createdAt: 0 },
  { id: "a1", name: "ChatGPT", url: "https://chat.openai.com", categoryId: "ai", createdAt: 0, favorite: true },
  { id: "a2", name: "Claude", url: "https://claude.ai", categoryId: "ai", createdAt: 0 },
  { id: "a3", name: "Gemini", url: "https://gemini.google.com", categoryId: "ai", createdAt: 0 },
  { id: "a4", name: "Perplexity", url: "https://perplexity.ai", categoryId: "ai", createdAt: 0 },
  { id: "c1", name: "GitHub", url: "https://github.com", categoryId: "coding", createdAt: 0, favorite: true },
  { id: "c2", name: "Stack Overflow", url: "https://stackoverflow.com", categoryId: "coding", createdAt: 0 },
  { id: "c3", name: "CodeSandbox", url: "https://codesandbox.io", categoryId: "coding", createdAt: 0 },
  { id: "c4", name: "MDN", url: "https://developer.mozilla.org", categoryId: "coding", createdAt: 0 },
  { id: "s1", name: "X", url: "https://x.com", categoryId: "social", createdAt: 0 },
  { id: "s2", name: "LinkedIn", url: "https://linkedin.com", categoryId: "social", createdAt: 0 },
  { id: "s3", name: "Reddit", url: "https://reddit.com", categoryId: "social", createdAt: 0 },
  { id: "sh1", name: "Amazon", url: "https://amazon.com", categoryId: "shopping", createdAt: 0 },
  { id: "sh2", name: "eBay", url: "https://ebay.com", categoryId: "shopping", createdAt: 0 },
  { id: "t1", name: "Notion", url: "https://notion.so", categoryId: "tools", createdAt: 0 },
  { id: "t2", name: "Figma", url: "https://figma.com", categoryId: "tools", createdAt: 0 },
  { id: "e1", name: "Netflix", url: "https://netflix.com", categoryId: "entertainment", createdAt: 0 },
  { id: "e2", name: "Spotify", url: "https://open.spotify.com", categoryId: "entertainment", createdAt: 0 },
];

const DEFAULT_PROFILE: Profile = {
  name: "Your Name",
  bio: "Welcome to ApratimTab",
  socials: [],
};

const DEFAULT_SETTINGS: SettingsState = {
  wallpaper: {
    provider: "gradient",
    blur: 0,
    brightness: 1,
    overlayOpacity: 0.35,
  },
  weatherUnits: "metric",
  theme: "dark",
};

// -----------------------------------------------------------------------------
// Adapter: bridge zustand persist -> chrome.storage (sync vs local per key)
// -----------------------------------------------------------------------------

function makeStorage(area: "sync" | "local"): PersistStorage<unknown> {
  return {
    getItem: async (name) => {
      const v = await storageGet<unknown>(area, name, null);
      return v as any;
    },
    setItem: async (name, value) => {
      await storageSet(area, name, value);
    },
    removeItem: async (name) => {
      await storageSet(area, name, null);
    },
  };
}

// -----------------------------------------------------------------------------
// Main store (settings + profile + categories + apps in one for simplicity)
// -----------------------------------------------------------------------------

interface StoreState {
  hydrated: boolean;
  apps: AppItem[];
  categories: Category[];
  profile: Profile;
  settings: SettingsState;
  activeCategoryId: string;
  // ephemeral (local)
  notes: Note[];
  todos: Todo[];
  recent: RecentApp[];
  clipboard: string[];

  setActiveCategory: (id: string) => void;
  addApp: (data: Omit<AppItem, "id" | "createdAt">) => void;
  updateApp: (id: string, data: Partial<AppItem>) => void;
  removeApp: (id: string) => void;
  toggleFavorite: (id: string) => void;
  recordVisit: (id: string) => void;

  addCategory: (name: string, icon?: string) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (ids: string[]) => void;

  setProfile: (p: Partial<Profile>) => void;
  setSettings: (p: Partial<SettingsState>) => void;
  setWallpaper: (p: Partial<WallpaperSettings>) => void;

  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  removeNote: (id: string) => void;

  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;

  pushClipboard: (v: string) => void;
  clearClipboard: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useApratimStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      apps: DEFAULT_APPS,
      categories: DEFAULT_CATEGORIES,
      profile: DEFAULT_PROFILE,
      settings: DEFAULT_SETTINGS,
      activeCategoryId: "home",
      notes: [],
      todos: [],
      recent: [],
      clipboard: [],

      setActiveCategory: (id) => set({ activeCategoryId: id }),

      addApp: (data) =>
        set((s) => ({
          apps: [...s.apps, { ...data, id: uid(), createdAt: Date.now() }],
        })),
      updateApp: (id, data) =>
        set((s) => ({ apps: s.apps.map((a) => (a.id === id ? { ...a, ...data } : a)) })),
      removeApp: (id) => set((s) => ({ apps: s.apps.filter((a) => a.id !== id) })),
      toggleFavorite: (id) =>
        set((s) => ({
          apps: s.apps.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a)),
        })),
      recordVisit: (id) =>
        set((s) => {
          const next = [{ appId: id, visitedAt: Date.now() }, ...s.recent.filter((r) => r.appId !== id)];
          return { recent: next.slice(0, 24) };
        }),

      addCategory: (name, icon = "Folder") =>
        set((s) => ({
          categories: [
            ...s.categories,
            { id: uid(), name, icon, order: s.categories.length },
          ],
        })),
      updateCategory: (id, data) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      removeCategory: (id) =>
        set((s) => {
          const cat = s.categories.find((c) => c.id === id);
          if (!cat || cat.builtin) return s;
          return {
            categories: s.categories.filter((c) => c.id !== id),
            apps: s.apps.filter((a) => a.categoryId !== id),
            activeCategoryId: s.activeCategoryId === id ? "home" : s.activeCategoryId,
          };
        }),
      reorderCategories: (ids) =>
        set((s) => ({
          categories: ids
            .map((id, order) => {
              const c = s.categories.find((x) => x.id === id);
              return c ? { ...c, order } : null;
            })
            .filter(Boolean) as Category[],
        })),

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setWallpaper: (p) =>
        set((s) => ({ settings: { ...s.settings, wallpaper: { ...s.settings.wallpaper, ...p } } })),

      addNote: (content) =>
        set((s) => ({ notes: [{ id: uid(), content, updatedAt: Date.now() }, ...s.notes] })),
      updateNote: (id, content) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n)),
        })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addTodo: (text) =>
        set((s) => ({ todos: [{ id: uid(), text, done: false, createdAt: Date.now() }, ...s.todos] })),
      toggleTodo: (id) =>
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      pushClipboard: (v) =>
        set((s) => ({ clipboard: [v, ...s.clipboard.filter((x) => x !== v)].slice(0, 25) })),
      clearClipboard: () => set({ clipboard: [] }),
    }),
    {
      name: "apratimtab-store",
      storage: createJSONStorage(() => {
        // Combine both areas by delegating based on key path; simpler: one area (local) for all in preview,
        // Chrome will use its own local area. Sync-worthy fields stay small and are duplicated for portability.
        return {
          getItem: async (name: string) => {
            const v = await storageGet<unknown>("local", name, null);
            return v ? JSON.stringify(v) : null;
          },
          setItem: async (name: string, value: string) => {
            await storageSet("local", name, JSON.parse(value));
          },
          removeItem: async (name: string) => {
            await storageSet("local", name, null);
          },
        };
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

// Selectors --------------------------------------------------------------

export const selectAppsByCategory = (id: string) => (s: StoreState) =>
  id === "recent"
    ? (s.recent
        .map((r) => s.apps.find((a) => a.id === r.appId))
        .filter(Boolean) as AppItem[])
    : id === "home"
      ? s.apps.filter((a) => a.favorite).concat(s.apps.filter((a) => !a.favorite))
      : s.apps.filter((a) => a.categoryId === id);

export const selectFavorites = (s: StoreState) => s.apps.filter((a) => a.favorite);

// silence unused warnings for helper areas
void makeStorage;