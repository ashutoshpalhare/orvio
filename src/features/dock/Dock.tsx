import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Clock, Bookmark, History, StickyNote, ListChecks,
  Calculator as CalcIcon, Star, Clipboard, Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Search$ = lazy(() => import("./panels/Search"));
const Recent$ = lazy(() => import("./panels/Recent"));
const Bookmarks$ = lazy(() => import("./panels/Bookmarks"));
const History$ = lazy(() => import("./panels/History"));
const Notes$ = lazy(() => import("./panels/Notes"));
const Todo$ = lazy(() => import("./panels/Todo"));
const Calculator$ = lazy(() => import("./panels/Calculator"));
const Favorites$ = lazy(() => import("./panels/Favorites"));
const Clipboard$ = lazy(() => import("./panels/Clipboard"));
const Weather$ = lazy(() => import("./panels/Weather"));

type PanelKey =
  | "search" | "recent" | "bookmarks" | "history"
  | "notes" | "todo" | "calc" | "favorites" | "clipboard" | "weather";

const ITEMS: { key: PanelKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "search", label: "Universal Search", icon: Search },
  { key: "recent", label: "Recent", icon: Clock },
  { key: "favorites", label: "Favorites", icon: Star },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { key: "history", label: "History", icon: History },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "todo", label: "Todo", icon: ListChecks },
  { key: "calc", label: "Calculator", icon: CalcIcon },
  { key: "clipboard", label: "Clipboard", icon: Clipboard },
  { key: "weather", label: "Weather", icon: Cloud },
];

function renderPanel(k: PanelKey) {
  switch (k) {
    case "search": return <Search$ />;
    case "recent": return <Recent$ />;
    case "bookmarks": return <Bookmarks$ />;
    case "history": return <History$ />;
    case "notes": return <Notes$ />;
    case "todo": return <Todo$ />;
    case "calc": return <Calculator$ />;
    case "favorites": return <Favorites$ />;
    case "clipboard": return <Clipboard$ />;
    case "weather": return <Weather$ />;
  }
}

export function Dock() {
  const [open, setOpen] = useState<PanelKey | null>(null);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40 w-[min(420px,92vw)] h-[440px] rounded-3xl bg-[var(--apt-panel-strong)] backdrop-blur-2xl border border-[var(--apt-border)] shadow-2xl p-4 overflow-hidden"
          >
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
              {renderPanel(open)}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(null)}
        />
      )}

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 24 }}
        className="fixed left-1/2 -translate-x-1/2 bottom-4 z-40"
      >
        <div className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-[var(--apt-panel-strong)] backdrop-blur-2xl border border-[var(--apt-border)] shadow-2xl">
          {ITEMS.map((it) => {
            const I = it.icon;
            const active = open === it.key;
            return (
              <button
                key={it.key}
                title={it.label}
                onClick={() => setOpen((cur) => (cur === it.key ? null : it.key))}
                className={cn(
                  "group relative p-2.5 rounded-xl transition-all hover:bg-[var(--apt-hover)]",
                  active && "bg-[var(--apt-active)]",
                )}
              >
                <I className={cn("size-5", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {active && (
                  <motion.span
                    layoutId="dock-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}