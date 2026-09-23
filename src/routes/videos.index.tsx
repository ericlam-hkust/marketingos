import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Video } from "lucide-react";
import { useApp, useT, tri } from "@/lib/app-state";
import { videos, videoStages, videoStageLabels } from "@/lib/mock-data";
import { PageHeader, Pill, pageHead, Thumb } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/videos/")({
  head: () => pageHead("影片製作 Videos", "Real-human presenter video pipeline: brief, script, teleprompter, takes, edits and hand-off."),
  component: Videos,
});

function Videos() {
  const t = useT();
  const { lang } = useApp();
  return (
    <div>
      <PageHeader title={t("主持人影片製作", "Presenter video production", "主持人视频制作")} sub={t("AI 幫手寫稿；絕不合成主持人樣貌或聲音。", "AI helps write — it never synthesizes the presenter's face or voice.", "AI 帮忙写稿；绝不合成主持人样貌或声音。")}
        actions={<Button><Plus className="size-4" />{t("新項目", "New project", "新项目")}</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((v, i) => {
          const idx = videoStages.indexOf(v.stage as (typeof videoStages)[number]);
          return (
            <Link key={v.id} to="/videos/$id" params={{ id: v.id }} className="flex gap-4 rounded-xl border bg-card p-4 lift">
              <Thumb hue={[20, 200, 90, 300][i]} kind="video" className="aspect-[9/16] w-24 shrink-0" />
              <div className="min-w-0 flex-1">
                <Pill tone={v.stage === "handed_off" ? "success" : "ai"}>{tri(lang, videoStageLabels[v.stage])}</Pill>
                <h3 className="mt-2 font-display text-[15px] font-bold">{v.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Video className="size-3.5" />{v.presenter} · {v.created}</p>
                <div className="mt-2 flex flex-wrap gap-1">{v.platforms.map((p) => <Pill key={p} tone="neutral" dot={false}>{p}</Pill>)}</div>
                <div className="mt-3 flex gap-0.5">{videoStages.map((s, k) => <span key={s} className={`h-1.5 flex-1 rounded-full ${k <= idx ? "bg-primary" : "bg-muted"}`} />)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
