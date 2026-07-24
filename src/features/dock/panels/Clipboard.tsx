import { useApratimStore } from "@/stores/useApratimStore";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export default function ClipboardPanel() {
  const items = useApratimStore((s) => s.clipboard);
  const push = useApratimStore((s) => s.pushClipboard);
  const clear = useApratimStore((s) => s.clearClipboard);

  const capture = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) push(t);
    } catch {
      /* permission denied */
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Clipboard</h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={capture}>
            Capture
          </Button>
          <Button size="sm" variant="ghost" onClick={clear}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Click Capture to save current clipboard contents.
        </p>
      )}
      <div className="flex-1 overflow-y-auto space-y-1">
        {items.map((v, i) => (
          <button
            key={i}
            onClick={() => navigator.clipboard.writeText(v)}
            className="w-full text-left p-2 rounded-lg hover:bg-[var(--apt-hover)] text-sm truncate flex items-center gap-2 group"
          >
            <Copy className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}