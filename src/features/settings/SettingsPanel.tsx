import { useApratimStore } from "@/stores/useApratimStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function SettingsPanel({ open, onOpenChange }: Props) {
  const settings = useApratimStore((s) => s.settings);
  const wp = settings.wallpaper;
  const setSettings = useApratimStore((s) => s.setSettings);
  const setWallpaper = useApratimStore((s) => s.setWallpaper);

  const handleLocalFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setWallpaper({ provider: "local", imageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[460px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5">
          <section className="space-y-3">
            <h4 className="text-sm font-semibold">Wallpaper</h4>
            <div>
              <Label>Provider</Label>
              <Select
                value={wp.provider}
                onValueChange={(v) =>
                  setWallpaper({ provider: v as typeof wp.provider })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">Default gradient</SelectItem>
                  <SelectItem value="local">Local upload</SelectItem>
                  <SelectItem value="url">Image URL</SelectItem>
                  <SelectItem value="unsplash">Unsplash</SelectItem>
                  <SelectItem value="pexels">Pexels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {wp.provider === "local" && (
              <div>
                <Label>Upload image</Label>
                <Input type="file" accept="image/*" onChange={(e) => handleLocalFile(e.target.files?.[0])} />
              </div>
            )}
            {wp.provider === "url" && (
              <div>
                <Label>Image URL</Label>
                <Input
                  value={wp.imageUrl ?? ""}
                  onChange={(e) => setWallpaper({ imageUrl: e.target.value })}
                  placeholder="https://.../photo.jpg"
                />
              </div>
            )}
            {(wp.provider === "unsplash" || wp.provider === "pexels") && (
              <div className="space-y-2">
                <div>
                  <Label>Query</Label>
                  <Input
                    value={wp.query ?? ""}
                    onChange={(e) => setWallpaper({ query: e.target.value })}
                    placeholder="mountains, minimal, cyberpunk…"
                  />
                </div>
                <div>
                  <Label>{wp.provider === "unsplash" ? "Unsplash Access Key" : "Pexels API Key"}</Label>
                  <Input
                    type="password"
                    value={
                      wp.provider === "unsplash"
                        ? (settings.unsplashKey ?? "")
                        : (settings.pexelsKey ?? "")
                    }
                    onChange={(e) =>
                      setSettings(
                        wp.provider === "unsplash"
                          ? { unsplashKey: e.target.value }
                          : { pexelsKey: e.target.value },
                      )
                    }
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setWallpaper({ query: wp.query ?? "nature" })}
                >
                  Shuffle image
                </Button>
              </div>
            )}

            <div>
              <Label>Blur ({wp.blur}px)</Label>
              <Slider value={[wp.blur]} min={0} max={20} step={1} onValueChange={([v]) => setWallpaper({ blur: v })} />
            </div>
            <div>
              <Label>Brightness ({wp.brightness.toFixed(2)})</Label>
              <Slider value={[wp.brightness]} min={0.3} max={1.2} step={0.05} onValueChange={([v]) => setWallpaper({ brightness: v })} />
            </div>
            <div>
              <Label>Overlay ({Math.round(wp.overlayOpacity * 100)}%)</Label>
              <Slider value={[wp.overlayOpacity]} min={0} max={0.8} step={0.05} onValueChange={([v]) => setWallpaper({ overlayOpacity: v })} />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-sm font-semibold">Weather</h4>
            <div>
              <Label>OpenWeatherMap API Key</Label>
              <Input
                type="password"
                value={settings.openWeatherKey ?? ""}
                onChange={(e) => setSettings({ openWeatherKey: e.target.value })}
                placeholder="Paste your key"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Get a free key from openweathermap.org.
              </p>
            </div>
            <div>
              <Label>Default city</Label>
              <Input
                value={settings.weatherCity ?? ""}
                onChange={(e) => setSettings({ weatherCity: e.target.value })}
                placeholder="e.g. Mumbai"
              />
            </div>
            <div>
              <Label>Units</Label>
              <Select
                value={settings.weatherUnits}
                onValueChange={(v) => setSettings({ weatherUnits: v as "metric" | "imperial" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (°C)</SelectItem>
                  <SelectItem value="imperial">Imperial (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}