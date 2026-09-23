import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Building2, ShieldCheck, ShieldAlert, Sparkles, Check, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/app-state";
import { leads, type Lead, people } from "@/lib/mock-data";
import { Card, CardHeader, Pill, StatusPill, pageHead, AiBadge } from "@/components/mos/ui";
import { ConfirmCard } from "@/components/mos/ConfirmCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leads/$id")({
  loader: ({ params }) => {
    const l = leads.find((x) => x.id === params.id);
    if (!l) throw notFound();
    return { l };
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.l.name, "Lead profile, pipeline status, audit timeline and human-approved outreach drafts.") : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: LeadDetail,
});

const stages: Lead["status"][] = ["new", "mql", "sql", "meeting", "opportunity"];

function LeadDetail() {
  const { l } = Route.useLoaderData();
  const t = useT();
  const [status, setStatus] = useState(l.status);
  const [draft, setDraft] = useState<"none" | "loading" | "draft" | "approved" | "discarded">("none");
  const [confirm, setConfirm] = useState(false);
  const idx = stages.indexOf(status);
  const gen = () => { setDraft("loading"); setTimeout(() => setDraft("draft"), 1400); };

  return (
    <div>
      <Link to="/leads" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />{t("潛在客戶", "Leads", "潜在客户")}</Link>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent font-display text-xl font-bold text-accent-foreground">{l.name.slice(0, 1)}</span>
        <div className="flex-1"><h1 className="font-display text-2xl font-bold">{l.name}</h1><p className="text-sm text-muted-foreground">{l.title} · {l.company}</p></div>
        <StatusPill status={status} />
      </div>
      <Card className="mb-5 p-4">
        <div className="flex items-center gap-1">
          {stages.map((s, i) => (
            <button key={s} onClick={() => { if (Math.abs(i - idx) <= 1 || status === "disqualified") { setStatus(s); toast(t("狀態已更新並記錄", "Status updated and logged", "状态已更新并记录")); } else toast.error(t("只可移前或移後一步", "Only one step at a time", "只可前进或后退一步")); }}
              className={cn("flex-1 rounded-lg py-2 text-[12px] font-semibold transition", i <= idx && status !== "disqualified" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary")}>
              <StatusLabel s={s} />
            </button>
          ))}
          <Button variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => setStatus(status === "disqualified" ? "new" : "disqualified")}>{status === "disqualified" ? t("重新開啟", "Re-open", "重新打开") : t("不合資格", "Disqualify", "不合格")}</Button>
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <Card className="space-y-3 p-5 text-[13px]">
            <p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{l.email}</p>
            <p className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />{l.company}</p>
            <p className="flex items-center gap-2">{l.consent ? <><ShieldCheck className="size-4 text-success" />{t("已同意接收推廣", "Opted in", "已同意接收推广")}</> : <><ShieldAlert className="size-4 text-warning" />{t("未同意 — 不可外展", "No consent — outreach blocked", "未同意 — 不可外展")}</>}</p>
            <p className="text-muted-foreground">{t("負責人", "Owner", "负责人")}：{people[l.owner].name}</p>
            <p className="text-muted-foreground">{t("評分", "Score", "评分")}：<span className="font-semibold text-foreground">{l.score}</span></p>
          </Card>
          <Card className="p-5">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("時間線", "Timeline", "时间线")}</p>
            <ol className="space-y-3 border-l pl-4 text-[12px]">
              {[["提交 LinkedIn 表格", "9/12"], ["開啟電子報", "9/15"], ["轉為 MQL（評分 > 60）", "9/16"], ["預約評估會議", "9/20"]].map(([a, d]) => <li key={a} className="relative"><span className="absolute top-1 -left-[21px] size-2 rounded-full bg-primary" />{a}<span className="ml-2 text-muted-foreground">{d}</span></li>)}
            </ol>
          </Card>
        </div>
        <Card className={cn(draft === "draft" && "ai-border")}>
          <CardHeader title={<span className="flex items-center gap-2">{t("外展草稿", "Outreach draft", "外展草稿")}<AiBadge /></span>} sub={t("絕不自動發送——必須由人批准。", "Never auto-sent — a human always approves.", "绝不自动发送——必须由人批准。")}
            action={draft !== "none" && <StatusPill status={draft === "approved" ? "approved" : draft === "discarded" ? "cancelled" : "draft"} />} />
          <div className="px-5 pb-5">
            {!l.consent ? (
              <p className="rounded-lg bg-warning/10 p-4 text-[13px] text-warning">{t("此客戶未同意接收推廣，無法生成外展訊息。", "This lead hasn't opted in; outreach generation is disabled.", "此客户未同意接收推广，无法生成外展信息。")}</p>
            ) : draft === "none" ? (
              <Button onClick={gen}><Sparkles className="size-4" />{t("生成個人化外展", "Generate personalised outreach", "生成个性化外展")}</Button>
            ) : draft === "loading" ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin text-ai" />{t("根據客戶資料及品牌語氣撰寫中…", "Writing from lead profile and brand tone…", "根据客户资料及品牌语气撰写中…")}</p>
            ) : (
              <div className="animate-in fade-in">
                <div className="rounded-xl border bg-surface-2/50 p-4 text-[13.5px] leading-7">
                  <p className="text-xs text-muted-foreground">{t("主旨", "Subject", "主旨")}：{l.company} 嘅月結報表，可以快 10 倍</p>
                  <p className="mt-3 whitespace-pre-line">{`${l.name} 你好，\n\n留意到 ${l.company} 近期喺擴充業務。好多同規模嘅公司都同我哋講，月尾報表要花成個星期。\n\n我哋最近幫葵涌一間物流公司將每日報表由 3 小時減到 5 分鐘。如果你有興趣，可以約 30 分鐘傾下？\n\nEric\nTonric 通力`}</p>
                </div>
                {draft === "draft" && (
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => setConfirm(true)}><Check className="size-4" />{t("批准", "Approve", "批准")}</Button>
                    <Button variant="outline" onClick={gen}>{t("重新生成", "Regenerate", "重新生成")}</Button>
                    <Button variant="ghost" onClick={() => setDraft("discarded")}><Trash2 className="size-4" />{t("捨棄", "Discard", "舍弃")}</Button>
                  </div>
                )}
                {draft === "approved" && <Pill tone="success" className="mt-3">{t("已批准 — 由負責人手動發送", "Approved — owner sends manually", "已批准 — 由负责人手动发送")}</Pill>}
              </div>
            )}
          </div>
        </Card>
      </div>
      <ConfirmCard open={confirm} onOpenChange={setConfirm} onConfirm={() => setDraft("approved")}
        payload={{ action: "send", channel: "email", account: "eric@tonric.hk", campaign: "物流業自動化報表方案", content: `外展 — ${l.name}`, copy: `${l.name} 你好，留意到 ${l.company} 近期喺擴充業務…` }} />
    </div>
  );
}

function StatusLabel({ s }: { s: string }) {
  const t = useT();
  const m: Record<string, string> = { new: t("新", "New", "新"), mql: "MQL", sql: "SQL", meeting: t("會議", "Meeting", "会议"), opportunity: t("商機", "Opportunity", "商机") };
  return <>{m[s]}</>;
}
