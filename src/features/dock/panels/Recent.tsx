import { useApratimStore } from "@/stores/useApratimStore";
import { faviconFor } from "@/features/apps/favicon";
import { openUrl } from "@/ext/chromeApis";

export default function RecentPanel() {
  const recent = useApratimStore((s) => s.recent);
  const apps = useApratimStore((s) => s.apps);

  const items = recent
    .map((r) => apps.find((a) => a.id === r.appId))
    .filter(Boolean) as { id: string; name: string; url: string; icon?: string }[];

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Recent Apps</h3>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Apps you open will show up here.
        </p>
      )}
      <div className="flex-1 overflow-y-auto space-y-1">
        {items.map((a) => (
          <button
            key={a.id}
            onClick={() => openUrl(a.url)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--apt-hover)] text-left"
          >
            <img src={a.icon || faviconFor(a.url)} alt="" className="size-6 rounded" />
            <span className="text-sm truncate">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}