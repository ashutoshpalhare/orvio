import { useEffect, useState } from "react";
import { useApratimStore } from "@/stores/useApratimStore";
import { getProvider } from "./providers";

export function Wallpaper() {
  const wp = useApratimStore((s) => s.settings.wallpaper);
  const settings = useApratimStore((s) => s.settings);
  const [resolved, setResolved] = useState<string | undefined>(wp.imageUrl);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (wp.provider === "unsplash" || wp.provider === "pexels") {
        const key = wp.provider === "unsplash" ? settings.unsplashKey : settings.pexelsKey;
        const p = getProvider(wp.provider);
        if (!p || !key) return;
        const url = await p.fetch(wp.query || "nature", key);
        if (!cancel && url) setResolved(url);
      } else {
        setResolved(wp.imageUrl);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [wp.provider, wp.query, wp.imageUrl, settings.unsplashKey, settings.pexelsKey]);

  const isImage = wp.provider !== "gradient" && !!resolved;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {isImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${resolved})`,
            filter: `blur(${wp.blur}px) brightness(${wp.brightness})`,
            transform: wp.blur > 0 ? "scale(1.05)" : undefined,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--apt-bg-gradient)]" />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: wp.overlayOpacity }} />
    </div>
  );
}