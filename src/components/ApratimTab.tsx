import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Info, User, Plus, Download } from "lucide-react";
import { useApratimStore } from "@/stores/useApratimStore";
import { Sidebar } from "@/features/sidebar/Sidebar";
import { AppGrid } from "@/features/apps/AppGrid";
import { AddAppDialog } from "@/features/apps/AddAppDialog";
import { Dock } from "@/features/dock/Dock";
import { Wallpaper } from "@/features/wallpaper/Wallpaper";
import { ProfilePanel } from "@/features/profile/ProfilePanel";
import { SettingsPanel } from "@/features/settings/SettingsPanel";
import { AboutPanel } from "@/features/about/AboutPanel";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

function Greeting({ name }: { name: string }) {
  const [g, setG] = useState<string | null>(null);
  useEffect(() => {
    const compute = () => {
      const h = new Date().getHours();
      setG(h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-xs text-muted-foreground">
      {g ?? "Hello"}, <span className="text-foreground font-medium">{name}</span>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-xs text-muted-foreground tabular-nums">
      {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
    </div>
  );
}

export function ApratimTab() {
  const active = useApratimStore((s) => s.activeCategoryId);
  const profile = useApratimStore((s) => s.profile);
  const [addOpen, setAddOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const downloadExtension = () => {
    fetch("/apratimtab.zip")
      .then((r) => {
        if (!r.ok) throw new Error("Zip not built yet");
        return r.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "apratimtab.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((e) => alert(e.message));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen flex overflow-hidden text-foreground">
        <Wallpaper />
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--apt-border)] bg-[var(--apt-panel)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Greeting name={profile.name} />
              <span className="text-muted-foreground/50">·</span>
              <Clock />
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setAddOpen(true)}>
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add App</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={downloadExtension}>
                    <Download className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download extension (.zip)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                    <Settings className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setAboutOpen(true)}>
                    <Info className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>About</TooltipContent>
              </Tooltip>
              <button
                onClick={() => setProfileOpen(true)}
                className="ml-1 size-8 rounded-full bg-[var(--apt-tile)] grid place-items-center overflow-hidden hover:ring-2 hover:ring-primary transition"
              >
                {profile.picture ? (
                  <img src={profile.picture} alt="" className="size-full object-cover" />
                ) : (
                  <User className="size-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </header>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-y-auto p-8 pb-32"
          >
            <AppGrid categoryId={active} onAdd={() => setAddOpen(true)} />
          </motion.div>
        </main>

        <Dock />

        <AddAppDialog open={addOpen} onOpenChange={setAddOpen} defaultCategoryId={active} />
        <ProfilePanel open={profileOpen} onOpenChange={setProfileOpen} />
        <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
        <AboutPanel open={aboutOpen} onOpenChange={setAboutOpen} />
      </div>
    </TooltipProvider>
  );
}