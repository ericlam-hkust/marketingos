import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, Columns2, GitCompare, History, Languages, Loader2, MessageSquare, RefreshCw, Send, Sparkles, Wand2, Copy, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { useApp, useT } from "@/lib/app-state";
import { campaigns, contentItems, people, type ContentStatus } from "@/lib/mock-data";
import { Avatar, Card, ChannelIcon, Pill, StatusPill, pageHead, channelName } from "@/components/mos/ui";
import { ConfirmCard } from "@/components/mos/ConfirmCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content/$id")({
  loader: ({ params }) => {
    const item = contentItems.find((x) => x.id === params.id);
    if (!item) throw notFound();
    return { id: item.id, title: item.title };
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.title, "Content editor with bilingual adaptation, version provenance, AI actions and automated brand checks.") : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: Editor,
});

const flow: ContentStatus[] = ["DRAFT", "SUBMITTED_FOR_REVIEW", "CHANGES_REQUESTED", "APPROVED", "SCHEDULED", "PUBLISHED"];

function Editor() {
  const { id } = Route.useLoaderData();
  const t = useT();
  const { content, setContentStatus } = useApp();
  const item = content.find((x) => x.id === id)!;
  const camp = campaigns.find((c) => c.id === item.campaignId)!;
  const [view, setView] = useState<"split" | "hk" | "en">("split");
  const [body, setBody] = useState(item.body);
  const [versions, setVersions] = useState(
    Array.from({ length: item.version }, (_, i) => ({
      v: item.version - i,
      who: i % 2 ? "Copilot" : people[item.owner].name,
      model: i % 2 ? "openai/gpt-6-astra" : "—",
      tpl: i % 2 ? "linkedin_post_v3" : t("手動編輯", "Manual edit", "手动编辑"),
      time: i === 0 ? item.updated : `${i + 1} 日前`,
    })),
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [side, setSide] = useState<"checks" | "versions" | "comments">("checks");
  const limit = item.channel === "linkedin" ? 3000 : item.channel === "instagram" ? 2200 : item.channel === "facebook" ? 63206 : 10000;
  const hasCta = /預約|報名|下載|了解|撳/.test(body);
  const banned = ["保證", "零成本", "取代員工"].filter((b) => body.includes(b));

  const aiAction = (label: string) => {
    setBusy(label);
    setTimeout(() => {
      setBusy(null);
      setVersions((v) => [{ v: v[0].v + 1, who: "Copilot", model: "openai/gpt-6-astra", tpl: label, time: t("剛剛", "just now", "刚刚") }, ...v]);
      if (label.includes("實用") || label.includes("practical")) setBody((b) => b.replace("好消息係：", "實際做法：").replace("👉", "✅"));
      toast.success(t(`已建立新版本 v${versions[0].v + 1}`, `Created new version v${versions[0].v + 1}`, `已建立新版本 v${versions[0].v + 1}`));
    }, 1400);
  };

  const idx = flow.indexOf(item.status);

  return (
    <div>
      <Link to="/content" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />{t("內容工作室", "Content Studio", "内容工作室")}</Link>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><ChannelIcon channel={item.channel} size="sm" />{item.type} · <Link to="/campaigns/$id" params={{ id: camp.id }} className="hover:text-primary">{camp.name}</Link></div>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight">{item.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Avatar who={item.owner} />
          <Button variant="outline" onClick={() => toast(t("已儲存草稿", "Draft saved", "已保存草稿"))}>{t("儲存", "Save", "保存")}</Button>
          {item.status === "APPROVED" ? (
            <Button onClick={() => setConfirm(true)}><CalendarClock className="size-4" />{t("排期", "Schedule", "排期")}</Button>
          ) : item.status === "DRAFT" || item.status === "CHANGES_REQUESTED" ? (
            <Button onClick={() => { setContentStatus(item.id, "SUBMITTED_FOR_REVIEW"); toast.success(t("已提交審批請求", "Approval request created", "已提交审批请求")); }}><Send className="size-4" />{t("提交審閱", "Submit for review", "提交审阅")}</Button>
          ) : null}
        </div>
      </div>

      {/* Workflow bar */}
      <Card className="mb-4 flex items-center gap-1 overflow-x-auto p-2">
        {flow.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div className={cn("flex min-w-max items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium", i === idx ? "bg-primary/10 text-primary" : i < idx ? "text-foreground" : "text-muted-foreground")}>
              <span className={cn("grid size-4 place-items-center rounded-full text-[9px]", i < idx ? "bg-success text-primary-foreground" : i === idx ? "bg-primary text-primary-foreground" : "bg-muted")}>{i < idx ? <Check className="size-2.5" /> : i + 1}</span>
              <StatusLabel s={s} />
            </div>
            {i < flow.length - 1 && <span className={cn("h-px min-w-3 flex-1", i < idx ? "bg-success" : "bg-border")} />}
          </div>
        ))}
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {/* AI toolbar */}
          <Card className="flex flex-wrap items-center gap-1.5 p-2">
            {[
              [Wand2, t("生成草稿", "Generate draft", "生成草稿")],
              [RefreshCw, t("改寫：更實用、少啲硬銷", "Rewrite: more practical, less salesy", "改写：更实用、少点硬销")],
              [Copy, t("建立變體", "Create variants", "建立变体")],
              [Languages, t("改編為英文", "Adapt to English", "改编为英文")],
              [Columns2, t("按渠道改編", "Adapt per channel", "按渠道改编")],
            ].map(([I, l]) => {
              const Icon = I as typeof Wand2;
              return (
                <button key={l as string} disabled={!!busy} onClick={() => aiAction(l as string)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium hover:bg-ai/10 disabled:opacity-50">
                  {busy === l ? <Loader2 className="size-3.5 animate-spin text-ai" /> : <Icon className="size-3.5 text-ai" />}{l as string}
                </button>
              );
            })}
            <div className="ml-auto flex rounded-lg border p-0.5 text-[11px] font-medium">
              {(["hk", "split", "en"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={cn("rounded-md px-2 py-1", view === v ? "bg-secondary" : "text-muted-foreground")}>{v === "hk" ? "繁中" : v === "en" ? "EN" : t("並排", "Split", "并排")}</button>
              ))}
            </div>
          </Card>

          <div className={cn("grid gap-3", view === "split" && "lg:grid-cols-2")}>
            {view !== "en" && (
              <Card className={cn("relative overflow-hidden", busy && "ai-border")}>
                <div className="flex items-center justify-between border-b px-4 py-2"><span className="flex items-center gap-2 text-xs font-semibold">zh-HK <Pill tone="primary" dot={false}>{t("原文", "Original", "原文")}</Pill></span><span className="text-[11px] tabular-nums text-muted-foreground">{body.length} / {limit}</span></div>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[340px] w-full resize-none bg-transparent p-4 text-[14px] leading-7 outline-none" />
              </Card>
            )}
            {view !== "hk" && (
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-2"><span className="flex items-center gap-2 text-xs font-semibold">EN <Pill tone="neutral" dot={false}>{t("連結改編", "Linked adaptation", "链接改编")}</Pill></span><span className="text-[11px] text-muted-foreground">{t("由 v", "from v", "由 v")}{item.version}</span></div>
                <div className="min-h-[340px] whitespace-pre-line p-4 text-[14px] leading-7 text-muted-foreground">{item.bodyEn}</div>
              </Card>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input placeholder={t("為下一個 AI 版本加入備註…", "Add a note for the next AI version…", "为下一个 AI 版本加入备注…")} className="h-9 flex-1 rounded-lg border bg-card px-3 text-[13px] outline-none focus:border-ring" />
            <Button variant="outline" size="sm"><Sparkles className="size-4 text-ai" />{t("應用", "Apply", "应用")}</Button>
          </div>
        </div>

        <Card className="h-fit overflow-hidden">
          <div className="flex border-b text-[12px] font-medium">
            {([["checks", t("檢查", "Checks", "检查")], ["versions", t("版本", "Versions", "版本")], ["comments", t("留言", "Comments", "留言")]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setSide(k)} className={cn("relative flex-1 py-2.5", side === k ? "text-foreground" : "text-muted-foreground")}>{l}{side === k && <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-primary" />}</button>
            ))}
          </div>
          {side === "checks" && (
            <div className="space-y-2 p-4">
              <p className="text-[11px] text-muted-foreground">{t("非阻擋性提示 · 即時檢查", "Non-blocking advisories · live", "非阻挡性提示 · 实时检查")}</p>
              {[
                { ok: body.length <= limit, l: t(`${channelName[item.channel]} 字數限制`, `${channelName[item.channel]} length limit`, `${channelName[item.channel]} 字数限制`), d: `${body.length} / ${limit}` },
                { ok: hasCta, l: t("包含 CTA", "Has CTA", "包含 CTA"), d: hasCta ? t("已偵測", "Detected", "已检测") : t("未偵測到行動呼籲", "No call-to-action found", "未检测到行动号召") },
                { ok: banned.length === 0, l: t("禁用詞", "Banned phrases", "禁用词"), d: banned.length ? banned.join("、") : t("無", "None", "无") },
                { ok: true, l: t("品牌語氣", "Brand tone", "品牌语气"), d: t("務實 · 唔硬銷 · 92 分", "Practical · low-pressure · 92", "务实 · 不硬销 · 92 分") },
                { ok: !body.includes("46"), l: t("聲稱風險", "Claim risk", "声称风险"), d: body.includes("46") ? t("「46 小時」需要來源", "\"46 hours\" needs a source", "「46 小时」需要来源") : t("無", "None", "无") },
              ].map((c) => (
                <div key={c.l} className={cn("flex items-start gap-2.5 rounded-lg border p-2.5", !c.ok && "border-warning/40 bg-warning/5")}>
                  {c.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />}
                  <div><p className="text-[12.5px] font-medium">{c.l}</p><p className="text-[11px] text-muted-foreground">{c.d}</p></div>
                </div>
              ))}
            </div>
          )}
          {side === "versions" && (
            <div className="p-3">
              <button className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg border py-1.5 text-[12px] font-medium hover:bg-secondary"><GitCompare className="size-3.5" />{t("比較版本", "Compare versions", "比较版本")}</button>
              <ol className="space-y-1.5">
                {versions.map((v, i) => (
                  <li key={v.v} className={cn("rounded-lg border p-2.5 animate-in fade-in", i === 0 && "border-primary/40 bg-primary/5")}>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[12.5px] font-semibold"><History className="size-3.5" />v{v.v}</span><span className="text-[11px] text-muted-foreground">{v.time}</span></div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{v.who} · {v.tpl}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{v.model}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {side === "comments" && (
            <div className="space-y-3 p-4">
              {[["mandy", "CTA 可以再短啲，@Ivy 幫手睇下？", "2 小時前"], ["ivy", "收到，我改咗做「免費預約評估」。", "1 小時前"]].map(([w, m, time]) => (
                <div key={m} className="flex gap-2.5"><Avatar who={w as "mandy"} size="sm" /><div><p className="text-[12.5px]">{m}</p><p className="text-[10.5px] text-muted-foreground">{time}</p></div></div>
              ))}
              <div className="flex gap-2"><input placeholder={t("留言，用 @ 提及同事", "Comment, @mention teammates", "留言，用 @ 提及同事")} className="h-8 flex-1 rounded-lg border bg-card px-2.5 text-[12px] outline-none" /><Button size="sm"><MessageSquare className="size-3.5" /></Button></div>
            </div>
          )}
        </Card>
      </div>

      <ConfirmCard open={confirm} onOpenChange={setConfirm} onConfirm={() => setContentStatus(item.id, "SCHEDULED")}
        payload={{ action: "schedule", channel: item.channel, account: "Tonric LinkedIn 公司專頁", campaign: camp.name, content: item.title, asset: "輪播 v4", time: t("星期二 上午 9:30 HKT", "Tuesday 9:30 AM HKT", "星期二 上午 9:30 HKT"), copy: body }} />
    </div>
  );
}

function StatusLabel({ s }: { s: string }) {
  const t = useT();
  const m: Record<string, string> = {
    DRAFT: t("草稿", "Draft", "草稿"), SUBMITTED_FOR_REVIEW: t("已提交", "Submitted", "已提交"), CHANGES_REQUESTED: t("需修改", "Changes", "需修改"),
    APPROVED: t("已批准", "Approved", "已批准"), SCHEDULED: t("已排期", "Scheduled", "已排期"), PUBLISHED: t("已發佈", "Published", "已发布"),
  };
  return <>{m[s]}</>;
}
