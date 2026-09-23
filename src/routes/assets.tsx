import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Upload, X, Send } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/app-state";
import { assets } from "@/lib/mock-data";
import { Card, PageHeader, Pill, StatusPill, Thumb, pageHead, AiBadge, Bar } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets")({
  head: () => pageHead("素材庫 Asset Library", "Creative assets with version lineage, channel renditions and AI generation jobs."),
  component: Assets,
});

function Assets() {
  const t = useT();
  const [sel, setSel] = useState<(typeof assets)[number] | null>(null);
  const [kind, setKind] = useState("all");
  const [job, setJob] = useState<null | number>(null);
  const run = () => {
    setJob(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 12;
      setJob(Math.min(p, 100));
      if (p >= 100) { clearInterval(iv); setTimeout(() => setJob(null), 800); toast.success(t("生成完成，已建立 v5", "Generation succeeded — v5 created", "生成完成，已建立 v5")); }
    }, 300);
  };
  const list = assets.filter((a) => kind === "all" || a.kind === kind);
  return (
    <div>
      <PageHeader title={t("素材庫", "Asset Library", "素材库")} sub={t("每個版本都記錄模型、提示及參考素材。", "Every version records model, prompt and reference inputs.", "每个版本都记录模型、提示及参考素材。")}
        actions={<><Button variant="outline"><Upload className="size-4" />{t("上載", "Upload", "上传")}</Button><Button onClick={run} disabled={job !== null}><Sparkles className="size-4" />{t("AI 生成", "Generate", "AI 生成")}</Button></>} />
      {job !== null && (
        <Card className="ai-border mb-4 flex items-center gap-4 p-4">
          <AiBadge>{job < 100 ? "running" : "succeeded"}</AiBadge>
          <div className="flex-1"><p className="mb-1.5 text-[13px] font-medium">{t("生成輪播 v5 — 人手報表隱藏成本", "Generating carousel v5", "生成轮播 v5")}</p><Bar value={job} tone="ai" /></div>
          <span className="text-xs tabular-nums text-muted-foreground">{job}%</span>
        </Card>
      )}
      <div className="mb-4 flex gap-1.5">
        {[["all", t("全部", "All", "全部")], ["image", t("圖片", "Image", "图片")], ["carousel", t("輪播", "Carousel", "轮播")], ["video", t("影片", "Video", "视频")]].map(([k, l]) => (
          <button key={k} onClick={() => setKind(k)} className={cn("rounded-full border px-3 py-1 text-[12px] font-medium", kind === k ? "border-primary bg-primary/10 text-primary" : "bg-card text-muted-foreground")}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((a) => (
          <button key={a.id} onClick={() => setSel(a)} className="group rounded-xl border bg-card p-2 text-left lift">
            <Thumb hue={a.hue} kind={a.kind} className="aspect-[4/3] transition group-hover:brightness-105" />
            <div className="px-1.5 pt-2.5 pb-1">
              <p className="truncate text-[13px] font-semibold">{a.title}</p>
              <div className="mt-1.5 flex items-center justify-between"><StatusPill status={a.status} /><span className="text-[11px] text-muted-foreground">{a.versions} {t("個版本", "versions", "个版本")}</span></div>
            </div>
          </button>
        ))}
      </div>
      <Sheet open={!!sel} onOpenChange={(v) => !v && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (
            <div className="space-y-5">
              <SheetTitle className="font-display text-lg">{sel.title}</SheetTitle>
              <Thumb hue={sel.hue} kind={sel.kind} className="aspect-video" />
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("版本譜系", "Version lineage", "版本谱系")}</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {Array.from({ length: sel.versions }, (_, i) => sel.versions - i).map((v) => (
                    <div key={v} className="w-28 shrink-0"><Thumb hue={(sel.hue + v * 12) % 360} kind={sel.kind} className="aspect-square" /><p className="mt-1 text-[11px] font-semibold">v{v}</p><p className="font-mono text-[9.5px] text-muted-foreground">gpt-image-2.5 · ref×2</p></div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("渠道尺寸", "Channel renditions", "渠道尺寸")}</p>
                <div className="flex flex-wrap items-end gap-3">
                  {[["LinkedIn", "1.91:1", "aspect-[1.91/1] w-28"], ["Facebook", "1:1", "aspect-square w-16"], ["Instagram", "4:5", "aspect-[4/5] w-14"], ["Story", "9:16", "aspect-[9/16] w-11"], ["Reel", "9:16", "aspect-[9/16] w-11"]].map(([n, r, c]) => (
                    <div key={n} className="text-center"><Thumb hue={sel.hue} kind="image" className={c} /><p className="mt-1 text-[10px] font-medium">{n}</p><p className="text-[9px] text-muted-foreground">{r}</p></div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                <div><p className="text-xs text-muted-foreground">{t("版權", "Rights", "版权")}</p><Pill tone="success">{t("已授權", "Cleared", "已授权")}</Pill></div>
                <div><p className="text-xs text-muted-foreground">{t("提示", "Prompt", "提示")}</p><p className="line-clamp-2">香港辦公室、Excel 表格堆疊、青綠色品牌色調</p></div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { toast.success(t("已提交審批", "Submitted for approval", "已提交审批")); setSel(null); }}><Send className="size-4" />{t("提交審批", "Submit for approval", "提交审批")}</Button>
                <Button variant="outline" onClick={() => setSel(null)}><X className="size-4" /></Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
