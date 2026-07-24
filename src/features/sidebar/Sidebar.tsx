import { memo, useState } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApratimStore, type Category } from "@/stores/useApratimStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Folder;
  return <C className={className} />;
}

const SidebarInner = () => {
  const categories = useApratimStore((s) => s.categories);
  const active = useApratimStore((s) => s.activeCategoryId);
  const setActive = useApratimStore((s) => s.setActiveCategory);
  const addCategory = useApratimStore((s) => s.addCategory);
  const updateCategory = useApratimStore((s) => s.updateCategory);
  const removeCategory = useApratimStore((s) => s.removeCategory);

  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <aside
      className={cn(
        "relative flex flex-col shrink-0 h-full py-4 gap-1 transition-all duration-300",
        "bg-[var(--apt-panel)] backdrop-blur-2xl border-r border-[var(--apt-border)]",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex items-center gap-2 px-4 mb-2">
        <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-[var(--apt-accent-2)] grid place-items-center text-primary-foreground font-bold shadow-lg">
          A
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-semibold tracking-tight">ApratimTab</div>
            <div className="text-[10px] text-muted-foreground">Productivity dashboard</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sorted.map((c) => (
          <CategoryRow
            key={c.id}
            category={c}
            active={active === c.id}
            collapsed={collapsed}
            editing={editingId === c.id}
            draftName={draftName}
            onSelect={() => setActive(c.id)}
            onStartEdit={() => {
              setEditingId(c.id);
              setDraftName(c.name);
            }}
            onSaveEdit={() => {
              if (draftName.trim()) updateCategory(c.id, { name: draftName.trim() });
              setEditingId(null);
            }}
            onDraftChange={setDraftName}
            onDelete={() => removeCategory(c.id)}
          />
        ))}
      </div>

      <div className="px-2 mt-2 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => {
            const name = window.prompt("New category name");
            if (name?.trim()) addCategory(name.trim());
          }}
        >
          <Icons.Plus className="size-4" />
          {!collapsed && <span>New Category</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <Icons.ChevronRight className="size-4" /> : <Icons.ChevronLeft className="size-4" />}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
};

interface RowProps {
  category: Category;
  active: boolean;
  collapsed: boolean;
  editing: boolean;
  draftName: string;
  onSelect: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onDraftChange: (v: string) => void;
  onDelete: () => void;
}

function CategoryRow({
  category,
  active,
  collapsed,
  editing,
  draftName,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onDraftChange,
  onDelete,
}: RowProps) {
  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
          "text-muted-foreground hover:bg-[var(--apt-hover)] hover:text-foreground",
          active && "bg-[var(--apt-active)] text-foreground shadow-inner",
        )}
      >
        <Icon name={category.icon} className="size-4 shrink-0" />
        <AnimatePresence initial={false}>
          {!collapsed && !editing && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="truncate flex-1 text-left"
            >
              {category.name}
            </motion.span>
          )}
        </AnimatePresence>
        {editing && !collapsed && (
          <Input
            autoFocus
            value={draftName}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            onClick={(e) => e.stopPropagation()}
            className="h-6 text-xs"
          />
        )}
        {active && (
          <motion.span
            layoutId="active-cat"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-primary"
          />
        )}
      </button>
      {!category.builtin && !collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--apt-hover)]">
              <Icons.MoreVertical className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onStartEdit}>Rename</DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export const Sidebar = memo(SidebarInner);