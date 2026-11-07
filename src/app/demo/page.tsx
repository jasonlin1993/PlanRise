import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo | PlanRise",
};

export default function DemoPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-canvas px-6 text-fg">
      <h1 className="text-2xl font-bold">Demo 開發中</h1>
      <Link href="/" className="text-accent-fg hover:underline">
        回首頁
      </Link>
    </main>
  );
}
