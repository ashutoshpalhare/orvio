import { useApratimStore, selectFavorites } from "@/stores/useApratimStore";
import { faviconFor } from "@/features/apps/favicon";
import { openUrl } from "@/ext/chromeApis";

export default function FavoritesPanel() {
  const favs = useApratimStore(selectFavorites);
  const record = useApratimStore((s) => s.recordVisit);
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Favorites</h3>
      {favs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Right-click any app tile and choose Favorite to pin it here.
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 overflow-y-auto">
        {favs.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              record(a.id);
              openUrl(a.url);
            }}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--apt-tile)] hover:bg-[var(--apt-tile-hover)]"
          >
            <img src={a.icon || faviconFor(a.url)} alt="" className="size-8 rounded" />
            <span className="text-[11px] truncate w-full text-center">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}