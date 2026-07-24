import { useEffect, useMemo, useState } from "react";
import { useApratimStore } from "@/stores/useApratimStore";
import { Input } from "@/components/ui/input";
import { getBookmarks, getHistory, openUrl, isExtension } from "@/ext/chromeApis";
import { faviconFor } from "@/features/apps/favicon";

interface Row {
  kind: string;
  id: string;
  title: string;
  url?: string;
  icon?: string;
}

export default function SearchPanel() {
  const apps = useApratimStore((s) => s.apps);
  const notes = useApratimStore((s) => s.notes);
  const todos = useApratimStore((s) => s.todos);
  const [q, setQ] = useState("");
  const [bookmarks, setBookmarks] = useState<Row[]>([]);
  const [history, setHistory] = useState<Row[]>([]);

  useEffect(() => {
    if (!isExtension()) return;
    getBookmarks().then((b) =>
      setBookmarks(
        b.map((x) => ({ kind: "Bookmarks", id: x.id, title: x.title, url: x.url })),
      ),
    );
    getHistory("", 200).then((h) =>
      setHistory(h.map((x) => ({ kind: "History", id: x.id, title: x.title, url: x.url }))),
    );
  }, []);

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return {} as Record<string, Row[]>;
    const appRows: Row[] = apps
      .filter((a) => a.name.toLowerCase().includes(ql) || a.url.toLowerCase().includes(ql))
      .map((a) => ({ kind: "Apps", id: a.id, title: a.name, url: a.url, icon: a.icon }));
    const noteRows: Row[] = notes
      .filter((n) => n.content.toLowerCase().includes(ql))
      .map((n) => ({ kind: "Notes", id: n.id, title: n.content.slice(0, 80) }));
    const todoRows: Row[] = todos
      .filter((t) => t.text.toLowerCase().includes(ql))
      .map((t) => ({ kind: "Tasks", id: t.id, title: t.text }));
    const bmRows = bookmarks.filter((b) => b.title.toLowerCase().includes(ql));
    const hRows = history.filter((h) => h.title.toLowerCase().includes(ql));

    const grouped: Record<string, Row[]> = {};
    for (const list of [appRows, noteRows, todoRows, bmRows, hRows]) {
      if (list.length) grouped[list[0].kind] = list.slice(0, 8);
    }
    return grouped;
  }, [q, apps, notes, todos, bookmarks, history]);

  const webSearch = () => {
    const u = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    openUrl(u);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Universal Search</h3>
      <Input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && q.trim() && webSearch()}
        placeholder="Search apps, bookmarks, history, notes, tasks…"
      />
      <div className="flex-1 overflow-y-auto mt-3 space-y-3">
        {Object.entries(results).map(([group, rows]) => (
          <div key={group}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              {group}
            </div>
            <div className="space-y-1">
              {rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() => r.url && openUrl(r.url)}
                  className="w-full flex items-center gap-2 text-left p-2 rounded-lg hover:bg-[var(--apt-hover)] text-sm"
                >
                  {r.url && (
                    <img src={r.icon || faviconFor(r.url)} alt="" className="size-4 rounded" />
                  )}
                  <span className="truncate">{r.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {q && Object.keys(results).length === 0 && (
          <button
            onClick={webSearch}
            className="w-full text-left p-2 rounded-lg hover:bg-[var(--apt-hover)] text-sm text-muted-foreground"
          >
            Search the web for “{q}”
          </button>
        )}
      </div>
    </div>
  );
}