import { useEffect, useState } from "react";
import { useApratimStore } from "@/stores/useApratimStore";
import { Input } from "@/components/ui/input";
import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react";

interface WeatherData {
  name: string;
  temp: number;
  desc: string;
  main: string;
  humidity: number;
  wind: number;
}

export default function WeatherPanel() {
  const key = useApratimStore((s) => s.settings.openWeatherKey);
  const city = useApratimStore((s) => s.settings.weatherCity);
  const units = useApratimStore((s) => s.settings.weatherUnits);
  const setSettings = useApratimStore((s) => s.setSettings);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key || !city) return;
    let cancel = false;
    setLoading(true);
    setError(null);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${key}`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed"))))
      .then((j) => {
        if (cancel) return;
        setData({
          name: j.name,
          temp: Math.round(j.main.temp),
          desc: j.weather?.[0]?.description ?? "",
          main: j.weather?.[0]?.main ?? "",
          humidity: j.main.humidity,
          wind: j.wind.speed,
        });
      })
      .catch(() => !cancel && setError("Couldn't fetch weather. Check API key and city."))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [key, city, units]);

  const Icon =
    data?.main === "Rain" ? CloudRain :
    data?.main === "Snow" ? CloudSnow :
    data?.main === "Clear" ? Sun : Cloud;

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Weather</h3>
      {!key && (
        <p className="text-sm text-muted-foreground">
          Add an OpenWeatherMap API key in Settings to enable weather.
        </p>
      )}
      {key && (
        <Input
          value={city ?? ""}
          placeholder="City name"
          onChange={(e) => setSettings({ weatherCity: e.target.value })}
          className="mb-3"
        />
      )}
      {loading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && !loading && (
        <div className="rounded-xl bg-[var(--apt-tile)] p-4">
          <div className="flex items-center gap-3">
            <Icon className="size-10 text-primary" />
            <div>
              <div className="text-3xl font-semibold">
                {data.temp}°{units === "metric" ? "C" : "F"}
              </div>
              <div className="text-sm text-muted-foreground capitalize">{data.desc}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {data.name} · Humidity {data.humidity}% · Wind {data.wind}
          </div>
        </div>
      )}
    </div>
  );
}