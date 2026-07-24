import { useEffect, useState } from "react";
import { getHistory, isExtension, openUrl, type HistoryItem } from "@/ext/chromeApis";
import { Input } from "@/components/ui/input";

export default function HistoryPanel() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    getHistory("", 200).then(setItems);
  }, []);

  const filtered = items.filter(
    (h) => h.title.toLowerCase().includes(q.toLowerCase()) || h.url.includes(q),
  );

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Browser History</h3>
      {!isExtension() ? (
        <p className="text-sm text-muted-foreground">
          Install ApratimTab as a Chrome extension to see history.
        </p>
      ) : (
        <>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history"
            className="mb-2"
          />
          <div className="flex-1 overflow-y-auto space-y-1">
            {filtered.slice(0, 200).map((h) => (
              <button
                key={h.id}
                onClick={() => openUrl(h.url)}
                className="w-full text-left p-2 rounded-lg hover:bg-[var(--apt-hover)] text-sm truncate"
              >
                {h.title}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}