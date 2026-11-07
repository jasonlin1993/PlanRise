import type { Metadata } from "next";
import { Suspense } from "react";
import { firstParam } from "@/features/editor/types";
import { ShareView } from "@/features/share/components/share-view";

export const metadata: Metadata = {
  title: "社區圖書館 1F | PlanRise",
};

type Props = PageProps<"/s/[slug]">;

export default function SharePage(props: Props) {
  return (
    <Suspense fallback={<div className="h-dvh bg-canvas" />}>
      <ShareContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

/** 切版狀態：?tab=area|conflicts */
async function ShareContent({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const tab = firstParam(sp.tab) === "conflicts" ? "conflicts" : "area";
  const base = `/s/${slug}`;
  return <ShareView tab={tab} hrefFor={{ area: base, conflicts: `${base}?tab=conflicts` }} />;
}
