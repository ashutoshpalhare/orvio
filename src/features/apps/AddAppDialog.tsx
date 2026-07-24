import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApratimStore } from "@/stores/useApratimStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Enter a valid URL (include https://)"),
  categoryId: z.string().min(1),
  icon: z.string().optional(),
  favorite: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCategoryId?: string;
}

export function AddAppDialog({ open, onOpenChange, defaultCategoryId }: Props) {
  const categories = useApratimStore((s) =>
    s.categories.filter((c) => c.id !== "recent" && c.id !== "home"),
  );
  const addApp = useApratimStore((s) => s.addApp);
  const [iconPreview, setIconPreview] = useState<string | undefined>();

  const defaultCat =
    defaultCategoryId && defaultCategoryId !== "home" && defaultCategoryId !== "recent"
      ? defaultCategoryId
      : (categories[0]?.id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", url: "", categoryId: defaultCat, favorite: false },
  });

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      form.setValue("icon", url);
      setIconPreview(url);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (v: FormValues) => {
    addApp({
      name: v.name,
      url: v.url,
      categoryId: v.categoryId,
      icon: v.icon,
      favorite: v.favorite,
    });
    form.reset();
    setIconPreview(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add App</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>App name</Label>
            <Input {...form.register("name")} placeholder="Gmail" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>URL</Label>
            <Input {...form.register("url")} placeholder="https://example.com" />
            {form.formState.errors.url && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(v) => form.setValue("categoryId", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Icon URL (optional)</Label>
            <Input
              placeholder="https://.../icon.png"
              onChange={(e) => {
                form.setValue("icon", e.target.value);
                setIconPreview(e.target.value);
              }}
            />
          </div>
          <div>
            <Label>Or upload icon</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {iconPreview && (
              <img src={iconPreview} alt="" className="size-10 rounded-lg mt-2" />
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[var(--apt-border)] p-3">
            <div>
              <Label>Favorite</Label>
              <p className="text-xs text-muted-foreground">Pin to Home</p>
            </div>
            <Switch
              checked={form.watch("favorite")}
              onCheckedChange={(v) => form.setValue("favorite", v)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}