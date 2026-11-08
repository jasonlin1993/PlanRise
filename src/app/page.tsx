import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 bg-canvas px-6 text-fg">
      <ThemeToggle className="absolute top-4 right-4" />

      <h1 className="text-5xl font-bold tracking-tight">PlanRise</h1>
      <p className="text-lg text-fg-muted">把平面圖，直接升成 3D。</p>
    </main>
  );
}
