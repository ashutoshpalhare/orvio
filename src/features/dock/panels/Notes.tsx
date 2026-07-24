import { useApratimStore } from "@/stores/useApratimStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export default function NotesPanel() {
  const notes = useApratimStore((s) => s.notes);
  const addNote = useApratimStore((s) => s.addNote);
  const updateNote = useApratimStore((s) => s.updateNote);
  const removeNote = useApratimStore((s) => s.removeNote);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Notes</h3>
        <Button size="sm" variant="ghost" onClick={() => addNote("")}>
          <Plus className="size-4 mr-1" /> New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            className="rounded-lg border border-[var(--apt-border)] bg-[var(--apt-tile)] p-2 group"
          >
            <Textarea
              value={n.content}
              onChange={(e) => updateNote(n.id, e.target.value)}
              placeholder="Type a note…"
              className="min-h-16 border-0 bg-transparent focus-visible:ring-0 resize-none"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{new Date(n.updatedAt).toLocaleString()}</span>
              <button
                onClick={() => removeNote(n.id)}
                className="opacity-0 group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}