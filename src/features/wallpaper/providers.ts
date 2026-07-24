// Extensible wallpaper provider registry.

export interface WallpaperProvider {
  id: string;
  label: string;
  needsKey: boolean;
  fetch: (query: string, apiKey?: string) => Promise<string | null>;
}

const unsplash: WallpaperProvider = {
  id: "unsplash",
  label: "Unsplash",
  needsKey: true,
  fetch: async (query, key) => {
    if (!key) return null;
    const q = encodeURIComponent(query || "nature");
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${q}&orientation=landscape&client_id=${key}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.urls?.full ?? data?.urls?.regular ?? null;
  },
};

const pexels: WallpaperProvider = {
  id: "pexels",
  label: "Pexels",
  needsKey: true,
  fetch: async (query, key) => {
    if (!key) return null;
    const q = encodeURIComponent(query || "nature");
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${q}&per_page=15&orientation=landscape`,
      { headers: { Authorization: key } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photos = data?.photos ?? [];
    if (!photos.length) return null;
    const pick = photos[Math.floor(Math.random() * photos.length)];
    return pick?.src?.original ?? pick?.src?.large2x ?? null;
  },
};

export const wallpaperProviders: WallpaperProvider[] = [unsplash, pexels];

export function getProvider(id: string): WallpaperProvider | undefined {
  return wallpaperProviders.find((p) => p.id === id);
}