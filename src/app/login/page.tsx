import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark, MockImage } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "登入 | PlanRise",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section aria-hidden className="relative hidden border-r border-border grid-paper lg:block">
        <MockImage
          src="/mock/plan-login.png"
          alt=""
          kind="plan"
          preload
          sizes="50vw"
          className="absolute inset-x-[4%] top-[18%] bottom-[22%]"
        />
        <p className="absolute bottom-8 left-8 font-mono text-[13px] leading-relaxed text-fg-muted">
          社區圖書館 1F
          <br />
          1:100・單位 mm
        </p>
      </section>

      <main className="relative flex flex-col bg-canvas px-6 py-8 lg:px-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          返回首頁
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <LogoMark className="size-12 rounded-xl [&_svg]:size-6" />
          <h1 className="mt-6 text-3xl font-bold">登入 PlanRise</h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            登入後可以儲存專案、圖層對應 preset 與機電衝突檢查紀錄，並產生唯讀分享連結。
          </p>
          <Button size="lg" className="mt-8 h-12 w-full gap-3 text-[15px]">
            <Image src="/google-g.svg" alt="" width={20} height={20} />
            使用 Google 帳號登入
          </Button>
          <p className="mt-4 text-[13px] text-fg-muted">
            我們只會讀取你的名稱與電子郵件，用來建立帳號。
          </p>
          <div className="my-8 h-px bg-border" />
          <p className="text-sm text-fg-muted">
            還沒準備好？
            <Link
              href="/demo"
              className="inline-flex items-center gap-1 text-accent-fg hover:underline"
            >
              先試用 Demo，不需登入
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
