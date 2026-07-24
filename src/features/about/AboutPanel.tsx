import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Github, Globe, Mail, Shield, ScrollText } from "lucide-react";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export const APRATIM_VERSION = "1.0.0";

export function AboutPanel({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>About ApratimTab</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5 text-sm">
          <div className="rounded-2xl p-4 bg-[var(--apt-tile)] border border-[var(--apt-border)]">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-[var(--apt-accent-2)] grid place-items-center text-primary-foreground font-bold text-xl shadow-lg">
                A
              </div>
              <div>
                <div className="font-semibold">ApratimTab</div>
                <div className="text-xs text-muted-foreground">Version {APRATIM_VERSION}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              A clean, fast, premium new-tab productivity dashboard.
            </p>
          </div>

          <section>
            <h4 className="font-semibold mb-1">Developer</h4>
            <p className="text-muted-foreground text-sm">Ashutosh Palhare</p>
          </section>

          <section className="space-y-2">
            <Link href="mailto:hello@apratimtab.app" icon={<Mail className="size-4" />} label="Contact" />
            <Link href="https://github.com/" icon={<Github className="size-4" />} label="GitHub" />
            <Link href="https://apratimtab.app" icon={<Globe className="size-4" />} label="Website" />
            <Link href="#privacy" icon={<Shield className="size-4" />} label="Privacy Policy" />
            <Link href="#changelog" icon={<ScrollText className="size-4" />} label="Changelog" />
          </section>

          <section>
            <h4 className="font-semibold mb-1">Changelog</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1.0.0 — Initial ApratimTab release: sidebar, dock, wallpaper providers, weather, notes, todo.</li>
            </ul>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Link({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--apt-hover)] transition-colors"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}