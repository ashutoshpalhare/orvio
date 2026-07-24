// Storage adapter: uses chrome.storage when available, falls back to localStorage
// so the same code works both inside the extension and in the Lovable preview.

type Area = "sync" | "local";

function hasChrome(area: Area): boolean {
  return (
    typeof globalThis !== "undefined" &&
    // @ts-expect-error - chrome global only exists inside the extension
    typeof globalThis.chrome !== "undefined" &&
    // @ts-expect-error
    !!globalThis.chrome?.storage?.[area]
  );
}

function lsKey(area: Area, key: string) {
  return `apratimtab:${area}:${key}`;
}

export async function storageGet<T>(area: Area, key: string, fallback: T): Promise<T> {
  try {
    if (hasChrome(area)) {
      // @ts-expect-error
      const res = await globalThis.chrome.storage[area].get(key);
      const v = res?.[key];
      return (v ?? fallback) as T;
    }
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(lsKey(area, key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function storageSet(area: Area, key: string, value: unknown): Promise<void> {
  try {
    if (hasChrome(area)) {
      // @ts-expect-error
      await globalThis.chrome.storage[area].set({ [key]: value });
      return;
    }
    if (typeof window === "undefined") return;
    window.localStorage.setItem(lsKey(area, key), JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function subscribeStorage(cb: () => void) {
  if (hasChrome("sync") || hasChrome("local")) {
    const listener = () => cb();
    // @ts-expect-error
    globalThis.chrome.storage.onChanged.addListener(listener);
    // @ts-expect-error
    return () => globalThis.chrome.storage.onChanged.removeListener(listener);
  }
  if (typeof window === "undefined") return () => {};
  const l = () => cb();
  window.addEventListener("storage", l);
  return () => window.removeEventListener("storage", l);
}