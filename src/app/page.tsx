import {
  Hero,
  MepSection,
  SiteFooter,
  SiteHeader,
  Steps,
} from "@/features/marketing/components/landing";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-fg">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Steps />
        <MepSection />
      </main>
      <SiteFooter />
    </div>
  );
}
