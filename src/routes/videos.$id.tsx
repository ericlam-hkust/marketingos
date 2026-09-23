import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lock, Unlock, MonitorPlay, Upload, Send, X, Play, Pause, FlipHorizontal, Sparkles, Check, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { useApp, useT, tri } from "@/lib/app-state";
import { videos, videoStages, videoStageLabels, scriptScenes } from "@/lib/mock-data";
import { Card, CardHeader, Pill, pageHead, AiBadge } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/videos/$id")({
  loader: ({ params }) => {
    const v = videos.find((x) => x.id === params.id);
    if (!v) throw notFound();
    return { v };
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.v.title, "Presenter video project: brief, script, teleprompter, takes, edit requests and hand-off.") : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: VideoProject,
});

function VideoProject() {
  const { v } = Route.useLoaderData();
  const t = useT();
  const { lang } = useApp();
  const [locked, setLocked] = useState(true);
  const [prompter, setPrompter] = useState(false);
  const [takes, setTakes] = useState([{ n: 1, size: "1.2 GB", note: "開頭口誤", sel: false }, { n: 2, size: "1.3 GB", note: "OK，眼神好", sel: true }, { n: 3, size: "1.1 GB", note: "第三段重拍", sel: true }]);
  const [handed, setHanded] = useState(v.stage === "handed_off");
  const idx = videoStages.indexOf(v.stage as (typeof videoStages)[number]);
  const total = scriptScenes.reduce((s, x) => s + x.sec, 0);

  return (
    <div>
      <Link to="/videos" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />{t("影片製作", "Videos", "视频制作")}</Link>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div><Pill tone="ai">{tri(lang, videoStageLabels[v.stage])}</Pill><h1 className="mt-2 font-display text-2xl font-bold">{v.title}</h1><p className="text-xs text-muted-foreground">{v.presenter} · {v.platforms.join(" · ")}</p></div>
        <Button onClick={() => setPrompter(true)}><MonitorPlay className="size-4" />{t("開啟提詞機", "Open teleprompter", "打开提词机")}</Button>
      </div>
      <Card className="mb-5 overflow-x-auto p-3">
        <div className="flex min-w-max items-center gap-1">
          {videoStages.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", i < idx ? "bg-success/12 text-success" : i === idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{tri(lang, videoStageLabels[s])}</span>
              {i < videoStages.length - 1 && <span className="h-px w-4 bg-border" />}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <CardHeader title={<span className="flex items-center gap-2">① {t("簡報", "Brief", "简报")}<AiBadge /></span>} action={<Button size="sm" variant="outline"><Sparkles className="size-3.5 text-ai" />{t("生成", "Generate", "生成")}</Button>} />
            <div className="grid gap-4 px-5 pb-5 text-[12.5px] md:grid-cols-2">
              <div><p className="text-xs font-semibold text-muted-foreground">{t("受眾", "Audience", "受众")}</p><p>香港中小企老闆及財務經理</p></div>
              <div><p className="text-xs font-semibold text-muted-foreground">Hook</p><p>「AI 好貴？其實每月幾百蚊。」</p></div>
              <div><p className="text-xs font-semibold text-muted-foreground">{t("重點", "Talking points", "重点")}</p><ul className="list-disc pl-4"><li>成本誤解</li><li>唔使換系統</li><li>唔會取代員工</li></ul></div>
              <div className="rounded-lg bg-destructive/8 p-3 ring-1 ring-destructive/20"><p className="text-xs font-semibold text-destructive">{t("切勿講", "Do NOT say", "切勿讲")}</p><ul className="list-disc pl-4 text-destructive"><li>「保證」慳錢</li><li>「零成本」</li><li>競爭對手名稱</li></ul></div>
            </div>
          </Card>
          <Card>
            <CardHeader title={`② ${t("腳本", "Script", "脚本")}`} sub={`${scriptScenes.length} ${t("場", "scenes", "场")} · ${total}s`}
              action={<div className="flex gap-2">
                <Pill tone={locked ? "success" : "warning"}>{locked ? t("已鎖定", "Locked", "已锁定") : t("編輯中", "Editing", "编辑中")}</Pill>
                <Button size="sm" variant="outline" onClick={() => setLocked(!locked)}>{locked ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}</Button>
                <Button size="sm" onClick={() => toast.success(t("已送往審批中心", "Sent to Approval Centre", "已送往审批中心"))}><Send className="size-3.5" />{t("提交審閱", "Submit", "提交审阅")}</Button>
              </div>} />
            <div className="divide-y border-t">
              {scriptScenes.map((s, i) => (
                <div key={i} className="grid grid-cols-[32px_1fr_160px_48px] gap-3 px-5 py-3 text-[13px]">
                  <span className="font-display font-bold text-muted-foreground">{i + 1}</span>
                  <p contentEditable={!locked} suppressContentEditableWarning className="leading-relaxed outline-none">{s.text}</p>
                  <p className="text-xs text-muted-foreground">🎥 {s.camera}</p>
                  <p className="text-right text-xs tabular-nums text-muted-foreground">{s.sec}s</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title={`④ ${t("拍攝片段", "Takes", "拍摄片段")}`} action={<Button size="sm" variant="outline" onClick={() => setTakes([...takes, { n: takes.length + 1, size: "1.0 GB", note: "新上載", sel: false }])}><Upload className="size-3.5" /></Button>} />
            <div className="space-y-2 px-4 pb-4">
              {takes.map((k) => (
                <label key={k.n} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-2.5", k.sel && "border-primary/50 bg-primary/5")}>
                  <input type="checkbox" checked={k.sel} onChange={() => setTakes(takes.map((x) => (x.n === k.n ? { ...x, sel: !x.sel } : x)))} className="accent-[var(--primary)]" />
                  <span className="font-display text-sm font-bold">#{k.n}</span>
                  <span className="flex-1 text-[12px]">{k.note}</span><span className="text-[11px] text-muted-foreground">{k.size}</span>
                </label>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title={`⑤ ${t("剪接請求", "Edit requests", "剪辑请求")}`} />
            <div className="px-4 pb-4 text-[12.5px]">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between"><span className="font-medium">外判剪接師 · Kit Studio</span><Pill tone="info">{t("剪接中", "In progress", "剪辑中")}</Pill></div>
                <p className="mt-1 text-xs text-muted-foreground">用 Take #2、#3；加字幕；9:16 同 16:9 兩個版本</p>
                <div className="mt-2 flex gap-1">{["requested", "in progress", "delivered", "approved"].map((s, i) => <span key={s} className={cn("h-1 flex-1 rounded-full", i <= 1 ? "bg-primary" : "bg-muted")} />)}</div>
              </div>
            </div>
          </Card>
          <Card className={cn("p-5", handed && "ai-border")}>
            <p className="font-semibold">⑥ {t("移交", "Hand-off", "移交")}</p>
            {handed ? (
              <div className="mt-2 text-[12.5px]"><p className="flex items-center gap-1.5 text-success"><Check className="size-4" />{t("已建立內容項目", "Content item created", "已建立内容项目")}</p><Link to="/content/$id" params={{ id: "vid-01" }} className="mt-1 block text-primary hover:underline">主持人影片 — 創辦人講 AI 誤解 →</Link></div>
            ) : (
              <><p className="mt-1 text-xs text-muted-foreground">{t("終剪批准後，移交到內容流程進行審閱、排期及發佈。", "After final cut, hand off to the content pipeline for review, scheduling and publishing.", "终剪批准后，移交到内容流程进行审阅、排期及发布。")}</p>
              <Button className="mt-3 w-full" onClick={() => { setHanded(true); toast.success(t("已移交", "Handed off", "已移交")); }}><PackageCheck className="size-4" />{t("移交到內容流程", "Hand off to content pipeline", "移交到内容流程")}</Button></>
            )}
          </Card>
        </div>
      </div>
      {prompter && <Teleprompter onClose={() => setPrompter(false)} />}
    </div>
  );
}

function Teleprompter({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(40);
  const [size, setSize] = useState(44);
  const [mirror, setMirror] = useState(false);
  const [scene, setScene] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); setPlaying((p) => !p); } if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.scrollTop += speed / 20;
      const nodes = Array.from(el.querySelectorAll("[data-scene]")) as HTMLElement[];
      const line = el.scrollTop + el.clientHeight * 0.4;
      const cur = nodes.findLastIndex((n) => n.offsetTop <= line);
      if (cur >= 0) setScene(cur);
    }, 50);
    return () => clearInterval(iv);
  }, [playing, speed]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[oklch(0.08_0_0)] text-[oklch(0.97_0_0)]">
      <div className="flex flex-wrap items-center gap-5 border-b border-[oklch(1_0_0/10%)] px-6 py-3 text-xs">
        <button onClick={() => setPlaying(!playing)} className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
        <label className="flex w-44 items-center gap-2">{t("速度", "Speed", "速度")}<Slider value={[speed]} min={10} max={120} onValueChange={(v) => setSpeed(v[0])} /></label>
        <label className="flex w-44 items-center gap-2">{t("字體", "Size", "字体")}<Slider value={[size]} min={28} max={80} onValueChange={(v) => setSize(v[0])} /></label>
        <button onClick={() => setMirror(!mirror)} className={cn("flex items-center gap-1.5 rounded-md px-2 py-1", mirror && "bg-[oklch(1_0_0/15%)]")}><FlipHorizontal className="size-4" />{t("鏡像", "Mirror", "镜像")}</button>
        <span className="opacity-60">{t("空白鍵 播放/暫停", "Space to play/pause", "空格键 播放/暂停")}</span>
        <button onClick={onClose} className="ml-auto grid size-9 place-items-center rounded-full hover:bg-[oklch(1_0_0/10%)]"><X className="size-5" /></button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[40%] z-10 h-px bg-primary shadow-[0_0_20px_var(--primary)]" />
        <div ref={ref} className="h-full overflow-y-auto px-[10%] py-[40vh]" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
          {scriptScenes.map((s, i) => (
            <p key={i} data-scene className={cn("mb-16 font-bold leading-snug transition-opacity duration-300", i === scene ? "opacity-100" : "opacity-35")} style={{ fontSize: size }}>{s.text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
