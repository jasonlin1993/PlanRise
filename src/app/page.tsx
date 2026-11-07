import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 bg-canvas px-6 text-fg">
      <ThemeToggle className="absolute top-4 right-4" />

      <h1 className="text-5xl font-bold tracking-tight">PlanRise</h1>
      <p className="text-lg text-fg-muted">把平面圖，直接升成 3D。</p>

      <Link
        href="/demo"
        className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-hover"
      >
        看 Demo
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </main>
  );
}
