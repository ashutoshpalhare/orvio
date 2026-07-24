import { useState } from "react";
import { useApratimStore } from "@/stores/useApratimStore";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

export default function TodoPanel() {
  const todos = useApratimStore((s) => s.todos);
  const addTodo = useApratimStore((s) => s.addTodo);
  const toggleTodo = useApratimStore((s) => s.toggleTodo);
  const removeTodo = useApratimStore((s) => s.removeTodo);
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Todo</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) {
            addTodo(text.trim());
            setText("");
          }
        }}
        className="mb-3"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task and press Enter"
        />
      </form>
      <div className="flex-1 overflow-y-auto space-y-1">
        {todos.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing to do.</p>
        )}
        {todos.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--apt-hover)] group"
          >
            <Checkbox checked={t.done} onCheckedChange={() => toggleTodo(t.id)} />
            <span
              className={
                t.done
                  ? "flex-1 text-sm line-through text-muted-foreground"
                  : "flex-1 text-sm"
              }
            >
              {t.text}
            </span>
            <button
              onClick={() => removeTodo(t.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}