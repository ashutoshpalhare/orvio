// Thin guards around Chrome extension APIs so the app degrades gracefully in the web preview.

function chromeGlobal(): any | null {
  // @ts-expect-error - chrome global only in extension
  return typeof globalThis !== "undefined" && globalThis.chrome ? globalThis.chrome : null;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url?: string;
  parent?: string;
}

export async function getBookmarks(): Promise<BookmarkItem[]> {
  const chrome = chromeGlobal();
  if (!chrome?.bookmarks) return [];
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((tree: any[]) => {
      const out: BookmarkItem[] = [];
      const walk = (nodes: any[], parent?: string) => {
        for (const n of nodes) {
          if (n.url) out.push({ id: n.id, title: n.title || n.url, url: n.url, parent });
          if (n.children) walk(n.children, n.title || parent);
        }
      };
      walk(tree);
      resolve(out);
    });
  });
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  lastVisitTime?: number;
}

export async function getHistory(query = "", max = 100): Promise<HistoryItem[]> {
  const chrome = chromeGlobal();
  if (!chrome?.history) return [];
  return new Promise((resolve) => {
    chrome.history.search({ text: query, maxResults: max, startTime: 0 }, (items: any[]) => {
      resolve(
        items.map((i) => ({
          id: i.id,
          title: i.title || i.url,
          url: i.url,
          lastVisitTime: i.lastVisitTime,
        })),
      );
    });
  });
}

export function openUrl(url: string, newTab = false) {
  const chrome = chromeGlobal();
  if (chrome?.tabs?.create && newTab) {
    chrome.tabs.create({ url });
    return;
  }
  if (typeof window !== "undefined") {
    if (newTab) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  }
}

export function isExtension(): boolean {
  return !!chromeGlobal()?.runtime?.id;
}