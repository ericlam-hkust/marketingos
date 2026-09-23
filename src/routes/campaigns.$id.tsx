import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Bar as RBar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowLeft, CalendarDays, RefreshCw, Sparkles, Target } from "lucide-react";
import { useApp, useT } from "@/lib/app-state";
import { assets, auditLog, calendarEntries, campaigns, contentItems, leads, people } from "@/lib/mock-data";
import { Avatar, Bar, Card, CardHeader, ChannelIcon, Pill, Ring, StatusPill, Thumb, AiBadge, pageHead, chBorder } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/campaigns/$id")({
  loader: ({ params }) => {
    const c = campaigns.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.c.name, `Campaign workspace for ${loaderData.c.nameEn}: strategy, content, creatives, calendar, leads and analytics.`) : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: CampaignWorkspace,
});

function CampaignWorkspace() {
  const { c } = Route.useLoaderData();
  const t = useT();
  const { lang } = useApp();
  const [tab, setTab] = useState("overview");
  const tabs = [
    ["overview", t("概覽", "Overview", "概览")], ["strategy", t("策略", "Strategy", "策略")], ["content", t("內容", "Content", "内容")],
    ["creatives", t("創意素材", "Creatives", "创意素材")], ["calendar", t("日曆", "Calendar", "日历")], ["leads", t("潛在客戶", "Leads", "潜在客户")],
    ["analytics", t("分析", "Analytics", "分析")], ["activity", t("動態", "Activity", "动态")],
  ];
  const content = contentItems.filter((x) => x.campaignId === c.id);
  const cLeads = leads.filter((x) => x.campaignId === c.id);

  return (
    <div>
      <Link to="/campaigns" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" />{t("營銷活動", "Campaigns", "营销活动")}</Link>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><StatusPill status={c.status} /><span className="text-xs text-muted-foreground">{c.objective} · {c.start} → {c.end}</span></div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{lang === "en" ? c.nameEn : c.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Avatar who={c.owner} size="sm" />{people[c.owner].name}</span>
            <span className="flex gap-1">{c.channels.map((ch) => <ChannelIcon key={ch} channel={ch} size="sm" />)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><CalendarDays className="size-4" />{t("排期", "Schedule", "排期")}</Button>
          <Button><Sparkles className="size-4" />{t("用 Copilot 生成內容", "Generate with Copilot", "用 Copilot 生成内容")}</Button>
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cn("relative whitespace-nowrap px-3 py-2.5 text-[13px] font-medium transition", tab === k ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {l}{tab === k && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300" key={tab}>
        {tab === "overview" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-semibold text-muted-foreground">{t("準備度", "Readiness", "准备度")}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative grid place-items-center"><Ring value={c.readiness} size={88} stroke={8} /><span className="absolute font-display text-xl font-bold">{c.readiness}%</span></div>
                <ul className="space-y-1 text-[12px]">
                  {[["簡報", true], ["受眾", true], ["內容", c.readiness > 70], ["素材", c.readiness > 80], ["追蹤連結", c.readiness > 85]].map(([l, ok]) => (
                    <li key={l as string} className="flex items-center gap-1.5"><span className={cn("size-1.5 rounded-full", ok ? "bg-success" : "bg-muted-foreground/40")} />{l as string}</li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card className="p-5 lg:col-span-2">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Target className="size-3.5" />{t("KPI 對目標", "KPIs vs targets", "KPI 对目标")}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[[c.kpi.label, c.kpi.value, c.kpi.target], [t("MQL", "MQL", "MQL"), 96, 150], [t("預算使用", "Budget used", "预算使用"), c.spent, c.budget]].map(([l, v, g]) => (
                  <div key={l as string}>
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="font-display text-xl font-bold tabular-nums">{(v as number).toLocaleString()}<span className="text-sm font-normal text-muted-foreground"> / {(g as number).toLocaleString()}</span></p>
                    <div className="mt-2"><Bar value={((v as number) / (g as number)) * 100} /></div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader title={t("下一步行動", "Next actions", "下一步行动")} />
              <div className="divide-y">
                {[["審批 IG 輪播 v2", "Ivy", "今日"], ["確認 LinkedIn 帖文 03 排期", "Mandy", "今日"], ["上載創辦人影片片段", "Kelvin", "星期五"], ["更新著陸頁 CTA 測試", "Sam", "下星期"]].map(([a, w, d]) => (
                  <div key={a} className="flex items-center gap-3 px-5 py-2.5 text-[13px]"><input type="checkbox" className="accent-[var(--primary)]" /><span className="flex-1">{a}</span><span className="text-xs text-muted-foreground">{w} · {d}</span></div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title={t("風險", "Risks", "风险")} icon={<AlertTriangle className="size-4" />} />
              <div className="space-y-2 px-5 pb-5 text-[12.5px]">
                {c.risk && <p className="rounded-lg bg-warning/10 p-2.5 text-warning">{c.risk}</p>}
                <p className="rounded-lg bg-secondary p-2.5">客戶案例需要書面同意先可以公開公司名。</p>
              </div>
            </Card>
          </div>
        )}
        {tab === "strategy" && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              [t("活動簡報", "Campaign brief", "活动简报"), "幫香港 20–200 人中小企搵出最值得自動化嘅報表流程，以免費 30 分鐘評估作為入口。"],
              [t("定位", "Positioning", "定位"), "務實、本地、唔使換系統嘅 AI 工作流程夥伴。"],
              [t("優惠", "Offer", "优惠"), c.cta],
              [t("訊息層次", "Message hierarchy", "信息层次"), "① 你每月蝕咗 46 小時 ② 4 星期可以改變 ③ 30 分鐘評估話你知由邊度開始"],
              [t("實驗", "Experiments", "实验"), "痛點開頭 vs 數據開頭；12:30 vs 09:30；輪播 vs 單圖"],
              [t("品牌指引", "Brand guardrails", "品牌指引"), "禁用：「保證」、「零成本」、「取代員工」"],
            ].map(([l, v]) => (
              <Card key={l} className="group p-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{l}</p>
                  <button onClick={() => toast(t("已根據品牌 DNA 重新生成新版本", "Regenerated with brand DNA", "已根据品牌 DNA 重新生成新版本"))} className="flex items-center gap-1 text-[11px] text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-ai"><RefreshCw className="size-3" />{t("AI 重新生成", "Regenerate", "AI 重新生成")}</button>
                </div>
                <p contentEditable suppressContentEditableWarning className="text-[13.5px] leading-relaxed outline-none">{v}</p>
              </Card>
            ))}
          </div>
        )}
        {tab === "content" && (
          <Card className="divide-y">
            {content.map((x) => (
              <Link key={x.id} to="/content/$id" params={{ id: x.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50">
                <ChannelIcon channel={x.channel} />
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{x.title}</p><p className="text-xs text-muted-foreground">{x.type} · {x.language} · v{x.version}</p></div>
                <StatusPill status={x.status} />
              </Link>
            ))}
          </Card>
        )}
        {tab === "creatives" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {assets.slice(0, 6).map((a) => (
              <Link to="/assets" key={a.id} className="lift rounded-xl border bg-card p-2"><Thumb hue={a.hue} kind={a.kind} className="aspect-square" /><p className="mt-2 truncate px-1 text-[12px] font-medium">{a.title}</p><div className="px-1 pb-1 pt-1"><StatusPill status={a.status} /></div></Link>
            ))}
          </div>
        )}
        {tab === "calendar" && (
          <Card className="divide-y">
            {calendarEntries.filter((e) => e.day >= 21).map((e, i) => (
              <div key={i} className={cn("flex items-center gap-3 border-l-4 px-5 py-3", chBorder[e.channel])}>
                <span className="w-16 text-xs font-semibold tabular-nums text-muted-foreground">9/{e.day} {e.time}</span>
                <ChannelIcon channel={e.channel} size="sm" /><span className="flex-1 text-[13px]">{e.title}</span><StatusPill status={e.status} />
              </div>
            ))}
          </Card>
        )}
        {tab === "leads" && (
          <Card className="divide-y">
            {cLeads.map((l) => (
              <Link key={l.id} to="/leads/$id" params={{ id: l.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50">
                <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{l.name.slice(0, 1)}</span>
                <div className="flex-1"><p className="text-[13px] font-medium">{l.name}</p><p className="text-xs text-muted-foreground">{l.title} · {l.company}</p></div>
                <span className="text-xs font-semibold tabular-nums">{l.score}</span><StatusPill status={l.status} />
              </Link>
            ))}
            {cLeads.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">{t("暫時未有潛在客戶", "No leads yet", "暂时没有潜在客户")}</p>}
          </Card>
        )}
        {tab === "analytics" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title={t("內容比較（互動率 %）", "Content comparison (engagement %)", "内容比较（互动率 %）")} />
              <div className="h-64 px-3 pb-4">
                <ResponsiveContainer>
                  <BarChart data={[{ n: "LI 03", v: 9.2 }, { n: "IG 輪播", v: 6.1 }, { n: "電子報", v: 4.3 }, { n: "FB 物流", v: 5.4 }, { n: "著陸頁", v: 3.8 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="n" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={30} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "var(--muted)" }} />
                    <RBar dataKey="v" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="ai-border p-5">
              <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold">{t("建議", "Recommendations", "建议")}<AiBadge /></p>
              <ul className="space-y-3 text-[12.5px]">
                <li>📈 {t("LI 03 痛點開頭效果最好，建議再做 2 個變體。", "Pain-led LI 03 performs best; create 2 more variants.", "LI 03 痛点开头效果最好，建议再做 2 个变体。")}</li>
                <li>⏰ {t("電子報改喺星期二早上發送。", "Send newsletter Tuesday morning.", "电子报改在星期二早上发送。")}</li>
                <li>🎯 {t("著陸頁 CTA 縮短至 10 字內。", "Shorten landing CTA to under 10 characters.", "着陆页 CTA 缩短至 10 字内。")}</li>
              </ul>
            </Card>
          </div>
        )}
        {tab === "activity" && (
          <Card className="p-5">
            <ol className="relative space-y-5 border-l pl-6">
              {auditLog.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute top-1 -left-[29px] size-3 rounded-full border-2 border-background bg-primary" />
                  <p className="text-[13px]"><span className="font-semibold">{e.actor}</span> <Pill tone="neutral" dot={false} className="mx-1 font-mono">{e.action}</Pill> {e.target}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.time}</p>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}
