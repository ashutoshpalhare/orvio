import { useApratimStore } from "@/stores/useApratimStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, User } from "lucide-react";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function ProfilePanel({ open, onOpenChange }: Props) {
  const profile = useApratimStore((s) => s.profile);
  const setProfile = useApratimStore((s) => s.setProfile);

  const handlePic = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile({ picture: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-[var(--apt-tile)] grid place-items-center overflow-hidden">
              {profile.picture ? (
                <img src={profile.picture} alt="" className="size-full object-cover" />
              ) : (
                <User className="size-8 text-muted-foreground" />
              )}
            </div>
            <Input type="file" accept="image/*" onChange={(e) => handlePic(e.target.files?.[0])} />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ name: e.target.value })} />
          </div>
          <div>
            <Label>Mobile</Label>
            <Input value={profile.mobile ?? ""} onChange={(e) => setProfile({ mobile: e.target.value })} />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={profile.bio ?? ""} onChange={(e) => setProfile({ bio: e.target.value })} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Social handles</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setProfile({ socials: [...profile.socials, { label: "", url: "" }] })
                }
              >
                <Plus className="size-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {profile.socials.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={s.label}
                    onChange={(e) => {
                      const next = [...profile.socials];
                      next[i] = { ...next[i], label: e.target.value };
                      setProfile({ socials: next });
                    }}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="https://…"
                    value={s.url}
                    onChange={(e) => {
                      const next = [...profile.socials];
                      next[i] = { ...next[i], url: e.target.value };
                      setProfile({ socials: next });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const next = profile.socials.filter((_, j) => j !== i);
                      setProfile({ socials: next });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}