import { useEffect, useState } from "react";
import { getBookmarks, isExtension, openUrl, type BookmarkItem } from "@/ext/chromeApis";
import { Input } from "@/components/ui/input";

export default function BookmarksPanel() {
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    getBookmarks().then(setItems);
  }, []);

  const filtered = items.filter(
    (b) => b.title.toLowerCase().includes(q.toLowerCase()) || b.url?.includes(q),
  );

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Bookmarks</h3>
      {!isExtension() ? (
        <p className="text-sm text-muted-foreground">
          Install ApratimTab as a Chrome extension to browse your bookmarks here.
        </p>
      ) : (
        <>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bookmarks"
            className="mb-2"
          />
          <div className="flex-1 overflow-y-auto space-y-1">
            {filtered.slice(0, 200).map((b) => (
              <button
                key={b.id}
                onClick={() => b.url && openUrl(b.url)}
                className="w-full text-left p-2 rounded-lg hover:bg-[var(--apt-hover)] text-sm truncate"
              >
                {b.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}