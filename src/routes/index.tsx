import { createFileRoute } from "@tanstack/react-router";
import { ApratimTab } from "@/components/ApratimTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApratimTab — Premium new-tab dashboard" },
      {
        name: "description",
        content:
          "ApratimTab is a fast, modern productivity dashboard: apps, universal search, notes, todos, weather, and glass-morphism wallpapers.",
      },
      { property: "og:title", content: "ApratimTab — Premium new-tab dashboard" },
      {
        property: "og:description",
        content:
          "A clean, fast, premium new-tab dashboard by Ashutosh Palhare — apps, universal search, notes, todos, and more.",
      },
    ],
  }),
  component: ApratimTabPage,
});

function ApratimTabPage() {
  return <ApratimTab />;
}
