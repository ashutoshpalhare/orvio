import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, Star } from "lucide-react";
import { useApratimStore, selectAppsByCategory, type AppItem } from "@/stores/useApratimStore";
import { faviconFor, hostOf } from "./favicon";
import { openUrl } from "@/ext/chromeApis";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Props {
  categoryId: string;
  onAdd: () => void;
}

function AppTile({ app }: { app: AppItem }) {
  const toggleFav = useApratimStore((s) => s.toggleFavorite);
  const remove = useApratimStore((s) => s.removeApp);
  const record = useApratimStore((s) => s.recordVisit);

  const icon = app.icon || faviconFor(app.url);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.button
          layout
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            record(app.id);
            openUrl(app.url, false);
          }}
          className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--apt-tile)] hover:bg-[var(--apt-tile-hover)] border border-[var(--apt-border)] transition-colors backdrop-blur-xl"
        >
          {app.favorite && (
            <Star className="absolute top-2 right-2 size-3 fill-amber-400 text-amber-400" />
          )}
          <div className="size-12 rounded-xl bg-[var(--apt-icon-bg)] grid place-items-center overflow-hidden shadow-sm">
            {icon ? (
              <img src={icon} alt="" className="size-8 rounded-md" loading="lazy" />
            ) : (
              <span className="text-lg font-semibold">{app.name[0]}</span>
            )}
          </div>
          <div className="text-xs font-medium text-center leading-tight line-clamp-1">
            {app.name}
          </div>
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {hostOf(app.url)}
          </div>
        </motion.button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => toggleFav(app.id)}>
          <Heart className="size-4 mr-2" />
          {app.favorite ? "Unfavorite" : "Favorite"}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => openUrl(app.url, true)}>Open in new tab</ContextMenuItem>
        <ContextMenuItem
          onClick={() => remove(app.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="size-4 mr-2" />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function AppGridInner({ categoryId, onAdd }: Props) {
  const apps = useApratimStore(selectAppsByCategory(categoryId));
  const category = useApratimStore((s) => s.categories.find((c) => c.id === categoryId));

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{category?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {apps.length} app{apps.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {apps.map((a) => (
          <AppTile key={a.id} app={a} />
        ))}
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={onAdd}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[var(--apt-border)] text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <div className="size-12 rounded-xl bg-[var(--apt-icon-bg)] grid place-items-center">
            <span className="text-2xl">+</span>
          </div>
          <div className="text-xs font-medium">Add App</div>
        </motion.button>
      </div>
      {apps.length === 0 && categoryId === "recent" && (
        <p className="text-sm text-muted-foreground mt-8">
          Recently visited apps will appear here.
        </p>
      )}
    </div>
  );
}

export const AppGrid = memo(AppGridInner);