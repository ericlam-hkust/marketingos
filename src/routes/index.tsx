import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Clock, Factory, Filter, Send, Sparkles, TrendingUp, Wand2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp, useT, tri } from "@/lib/app-state";
import { campaigns, funnel, performance, publishQueue, people } from "@/lib/mock-data";
import { AiBadge, Avatar, Bar, Card, CardHeader, ChannelIcon, Pill, Ring, StatusPill, Stat, pageHead } from "@/components/mos/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => pageHead("總覽 Dashboard", "Campaign health, approvals, publishing queue, lead funnel and AI recommendations at a glance."),
  component: Dashboard,
});

function Dashboard() {
  const t = useT();
  const { approvals, lang } = useApp();
  const pending = approvals.filter((a) => a.status === "pending");
  const [period, setPeriod] = useState<"7" | "14">("14");
  const data = period === "7" ? performance.slice(-7) : performance;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-card bg-hero p-6 lg:p-7">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("9 月 24 日 星期四 · 香港時間 00:06", "Thu, 24 Sep · 00:06 HKT", "9 月 24 日 星期四 · 香港时间 00:06")}</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{t("早晨，Eric 👋", "Good morning, Eric 👋", "早上好，Eric 👋")}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {t(`今日有 ${pending.length} 項待審批、1 個發佈失敗需要處理，另外 Copilot 有 3 個優化建議。`,
                `You have ${pending.length} approvals waiting, 1 failed post to fix, and 3 Copilot suggestions.`,
                `今天有 ${pending.length} 项待审批、1 个发布失败需要处理，另外 Copilot 有 3 个优化建议。`)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/approvals" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-card hover:bg-primary/90"><CheckCircle2 className="size-4" />{t("處理審批", "Review approvals", "处理审批")}</Link>
              <Link to="/campaigns" className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-2 text-[13px] font-semibold hover:bg-secondary"><Sparkles className="size-4 text-ai" />{t("用 AI 建立活動", "New campaign with AI", "用 AI 建立活动")}</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <Stat label={t("本月觸及", "Reach (MTD)", "本月触及")} value="284K" delta="18.2%" />
            <Stat label={t("互動率", "Engagement", "互动率")} value="7.9%" delta="1.1pt" />
            <Stat label={t("新潛在客戶", "New leads", "新潜在客户")} value="486" delta="24%" />
            <Stat label={t("預約會議", "Meetings", "预约会议")} value="41" delta="3" up={false} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Campaign health */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<Activity className="size-4" />} title={t("活動健康度", "Campaign health", "活动健康度")} sub={t("進行中及草稿活動", "Active and draft campaigns", "进行中及草稿活动")}
            action={<Link to="/campaigns" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">{t("全部", "View all", "全部")}<ArrowRight className="size-3" /></Link>} />
          <div className="divide-y">
            {campaigns.slice(0, 4).map((c) => {
              const pct = Math.round((c.kpi.value / c.kpi.target) * 100);
              return (
                <Link key={c.id} to="/campaigns/$id" params={{ id: c.id }} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 transition hover:bg-secondary/50 md:grid-cols-[auto_1.6fr_1fr_0.9fr_auto]">
                  <div className="relative grid place-items-center">
                    <Ring value={pct} />
                    <span className="absolute text-[10px] font-bold tabular-nums">{pct}%</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{lang === "en" ? c.nameEn : c.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <StatusPill status={c.status} /><span>{c.objective}</span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[11px] text-muted-foreground">{c.kpi.label}</p>
                    <p className="text-[13px] font-semibold tabular-nums">{c.kpi.value.toLocaleString()} <span className="font-normal text-muted-foreground">/ {c.kpi.target.toLocaleString()}</span></p>
                  </div>
                  <div className="hidden md:block">
                    <p className="mb-1 text-[11px] text-muted-foreground">{t("預算", "Budget", "预算")} HK${(c.spent / 1000).toFixed(0)}K / {(c.budget / 1000).toFixed(0)}K</p>
                    <Bar value={(c.spent / c.budget) * 100} tone={c.spent / c.budget > 0.6 && c.risk ? "warning" : "primary"} />
                  </div>
                  <div className="flex justify-end">
                    {c.risk ? <span title={c.risk} className="grid size-7 place-items-center rounded-full bg-warning/15 text-warning"><AlertTriangle className="size-3.5" /></span> : <Avatar who={c.owner} size="sm" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Approval inbox */}
        <Card>
          <CardHeader icon={<CheckCircle2 className="size-4" />} title={t("審批收件箱", "Approval inbox", "审批收件箱")} sub={t(`${pending.length} 項等待你`, `${pending.length} waiting on you`, `${pending.length} 项等待你`)}
            action={<Link to="/approvals" className="text-xs font-medium text-primary hover:underline">{t("開啟", "Open", "打开")}</Link>} />
          <div className="space-y-2 px-4 pb-4">
            {pending.slice(0, 4).map((a) => (
              <Link key={a.id} to="/approvals" className="flex items-center gap-3 rounded-lg border bg-surface-2/50 p-2.5 transition hover:border-primary/40 hover:bg-card">
                <ChannelIcon channel={a.channel} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{people[a.submittedBy].name.split(" ")[0]} · {a.submittedAt}</p>
                </div>
                <Pill tone={a.kind === "script" ? "ai" : a.kind === "asset" ? "info" : "neutral"} dot={false}>
                  {a.kind === "script" ? t("腳本", "Script", "脚本") : a.kind === "asset" ? t("素材", "Asset", "素材") : t("內容", "Content", "内容")}
                </Pill>
              </Link>
            ))}
            {pending.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">{t("全部處理完畢 🎉", "All clear 🎉", "全部处理完毕 🎉")}</p>}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Performance */}
        <Card className="xl:col-span-2">
          <CardHeader icon={<TrendingUp className="size-4" />} title={t("表現摘要", "Performance summary", "表现摘要")}
            sub={<span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" />LinkedIn 5 {t("分鐘前", "min ago", "分钟前")} · Meta 12 {t("分鐘前", "min ago", "分钟前")} · GA {t("1 小時前", "1 h ago", "1 小时前")}</span>}
            action={
              <div className="flex rounded-lg border p-0.5 text-[11px] font-medium">
                {(["7", "14"] as const).map((p) => (
                  <button key={p} onClick={() => setPeriod(p)} className={cn("rounded-md px-2 py-1", period === p ? "bg-secondary text-foreground" : "text-muted-foreground")}>{p}{t("日", "d", "日")}</button>
                ))}
              </div>
            } />
          <div className="grid grid-cols-4 gap-4 px-5 pb-2">
            <Stat label={t("觸及", "Reach", "触及")} value={(data.reduce((s, d) => s + d.reach, 0) / 1000).toFixed(0) + "K"} />
            <Stat label={t("互動", "Engagement", "互动")} value={(data.reduce((s, d) => s + d.engagement, 0) / 1000).toFixed(1) + "K"} />
            <Stat label={t("點擊", "Clicks", "点击")} value={data.reduce((s, d) => s + d.clicks, 0).toLocaleString()} />
            <Stat label={t("潛在客戶", "Leads", "潜在客户")} value={String(data.reduce((s, d) => s + d.leads, 0))} />
          </div>
          <div className="h-56 px-2 pb-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 0, right: 12, top: 10 }}>
                <defs>
                  <linearGradient id="gReach" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis yAxisId="l" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={40} tickFormatter={(v) => `${v / 1000}K`} />
                <YAxis yAxisId="r" orientation="right" hide />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Area yAxisId="l" type="monotone" dataKey="reach" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gReach)" name={t("觸及", "Reach", "触及")} />
                <Area yAxisId="r" type="monotone" dataKey="clicks" stroke="var(--chart-2)" strokeWidth={2} fill="url(#gClicks)" name={t("點擊", "Clicks", "点击")} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead funnel */}
        <Card>
          <CardHeader icon={<Filter className="size-4" />} title={t("潛在客戶漏斗", "Lead funnel", "潜在客户漏斗")} sub={t("過去 30 日", "Last 30 days", "过去 30 日")}
            action={<Link to="/leads" className="text-xs font-medium text-primary hover:underline">{t("開啟", "Open", "打开")}</Link>} />
          <div className="space-y-2.5 px-5 pb-5">
            {funnel.map((f, i) => {
              const w = (f.value / funnel[0].value) * 100;
              return (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-[12px]"><span className="font-medium">{tri(lang, f.stage as [string, string, string])}</span><span className="tabular-nums text-muted-foreground">{f.value}{i > 0 && <span className="ml-1.5 text-[10px]">({Math.round((f.value / funnel[i - 1].value) * 100)}%)</span>}</span></div>
                  <div className="h-7 overflow-hidden rounded-md bg-muted">
                    <div className="h-full rounded-md transition-all duration-700" style={{ width: `${Math.max(w, 6)}%`, background: `color-mix(in oklab, var(--primary) ${100 - i * 14}%, var(--ai))` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <PublishingQueue />
        {/* Production */}
        <Card>
          <CardHeader icon={<Factory className="size-4" />} title={t("製作進度", "Production status", "制作进度")} sub={t("內容及素材按階段", "Content & creative by stage", "内容及素材按阶段")} />
          <div className="px-5 pb-5">
            <div className="flex h-3 overflow-hidden rounded-full">
              {[[14, "bg-muted-foreground/40"], [9, "bg-info"], [11, "bg-success"], [7, "bg-primary"], [23, "bg-ai"]].map(([v, c], i) => (
                <div key={i} className={cn(c as string, "h-full")} style={{ flex: v as number }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {[
                [14, t("草稿", "Draft", "草稿"), "bg-muted-foreground/40"], [9, t("審閱中", "Review", "审阅中"), "bg-info"],
                [11, t("已批准", "Approved", "已批准"), "bg-success"], [7, t("已排期", "Scheduled", "已排期"), "bg-primary"], [23, t("已發佈", "Published", "已发布"), "bg-ai"],
              ].map(([v, l, c]) => (
                <div key={l as string}>
                  <p className="font-display text-xl font-bold tabular-nums">{v}</p>
                  <p className="flex items-center justify-center gap-1 text-[10.5px] text-muted-foreground"><span className={cn("size-1.5 rounded-full", c as string)} />{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
        {/* AI recommendations */}
        <Card className="ai-border">
          <CardHeader icon={<Wand2 className="size-4 text-ai" />} title={<span className="flex items-center gap-2">{t("AI 建議", "AI recommendations", "AI 建议")}<AiBadge /></span>} sub={t("按影響排序，附帶原因", "Ranked by impact, with reasoning", "按影响排序，附带原因")} />
          <div className="space-y-2.5 px-4 pb-4">
            {[
              { p: t("高", "High", "高"), title: t("將 IG 快拍改為 9:16 並重新排期", "Re-cut IG Story to 9:16 and reschedule", "将 IG 快拍改为 9:16 并重新排期"), why: t("原因：發佈失敗，且倒數快拍過去帶來 22% 預約。", "Why: post failed, and countdown Stories drove 22% of bookings.", "原因：发布失败，且倒数快拍过去带来 22% 预约。") },
              { p: t("中", "Med", "中"), title: t("LinkedIn 帖文改喺 12:30 發佈", "Move LinkedIn posts to 12:30", "LinkedIn 帖文改在 12:30 发布"), why: t("原因：財務經理受眾午飯時段互動高 41%。", "Why: finance managers engage 41% more at lunch.", "原因：财务经理受众午饭时段互动高 41%。") },
              { p: t("中", "Med", "中"), title: t("為物流活動加入 ROI 計算機", "Add ROI calculator to logistics campaign", "为物流活动加入 ROI 计算机"), why: t("原因：同類活動中，互動工具轉化率高 2.3 倍。", "Why: interactive tools convert 2.3× better in similar campaigns.", "原因：同类活动中，互动工具转化率高 2.3 倍。") },
            ].map((r, i) => (
              <div key={i} className="rounded-lg border bg-card p-3 lift">
                <div className="flex items-start gap-2">
                  <Pill tone={i === 0 ? "destructive" : "warning"} dot={false}>{r.p}</Pill>
                  <p className="text-[12.5px] font-semibold leading-snug">{r.title}</p>
                </div>
                <p className="mt-1.5 text-[11.5px] text-muted-foreground">{r.why}</p>
                <button onClick={() => toast.success(t("已建立草稿任務", "Draft task created", "已建立草稿任务"))} className="mt-2 text-[11px] font-semibold text-primary hover:underline">{t("建立草稿 →", "Create draft →", "建立草稿 →")}</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PublishingQueue() {
  const t = useT();
  const [retried, setRetried] = useState(false);
  return (
    <Card>
      <CardHeader icon={<Send className="size-4" />} title={t("發佈隊列", "Publishing queue", "发布队列")} sub={t("今日", "Today", "今天")}
        action={<Link to="/publishing" className="text-xs font-medium text-primary hover:underline">{t("開啟", "Open", "打开")}</Link>} />
      <div className="space-y-2 px-4 pb-4">
        {publishQueue.slice(0, 4).map((p) => {
          const status = p.status === "failed" && retried ? "scheduled" : p.status;
          return (
            <div key={p.id} className={cn("rounded-lg border p-2.5", status === "failed" && "border-destructive/40 bg-destructive/5")}>
              <div className="flex items-center gap-2.5">
                <ChannelIcon channel={p.channel} size="sm" />
                <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{p.title}</p>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="size-3" />{p.time.replace("今日 ", "")}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between pl-7">
                <StatusPill status={status} />
                {status === "failed" && (
                  <button onClick={() => { setRetried(true); toast.success(t("已重試（冪等，不會重複發佈）", "Retried (idempotent, no double-post)", "已重试（幂等，不会重复发布）")); }} className="flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"><RotateCcw className="size-3" />{t("重試", "Retry", "重试")}</button>
                )}
              </div>
              {status === "failed" && <p className="mt-1.5 pl-7 font-mono text-[10.5px] text-destructive/90">{p.error}</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
