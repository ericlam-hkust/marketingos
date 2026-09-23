import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, List, Plus, Search, Sparkles, Check, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useApp, useT } from "@/lib/app-state";
import { campaigns } from "@/lib/mock-data";
import { Avatar, Bar, Card, ChannelIcon, PageHeader, StatusPill, pageHead, AiBadge } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campaigns/")({
  head: () => pageHead("營銷活動 Campaigns", "Plan, track and manage every multi-channel marketing campaign."),
  component: CampaignsPage,
});

function CampaignsPage() {
  const t = useT();
  const { lang } = useApp();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [wizard, setWizard] = useState(false);
  const list = campaigns.filter((c) => (status === "all" || c.status === status) && (c.name + c.nameEn).toLowerCase().includes(q.toLowerCase()));
  const statuses = ["all", "active", "draft", "paused", "completed"];
  const sl: Record<string, string> = { all: t("全部", "All", "全部"), active: t("進行中", "Active", "进行中"), draft: t("草稿", "Draft", "草稿"), paused: t("已暫停", "Paused", "已暂停"), completed: t("已完成", "Completed", "已完成") };

  return (
    <div>
      <PageHeader title={t("營銷活動", "Campaigns", "营销活动")} sub={t("每件素材、帖文、潛在客戶及報告都屬於一個活動。", "Every asset, post, lead and report belongs to a campaign.", "每件素材、帖文、潜在客户及报告都属于一个活动。")}
        actions={<Button onClick={() => setWizard(true)}><Plus className="size-4" />{t("新活動", "New campaign", "新活动")}</Button>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("搜尋活動", "Search campaigns", "搜索活动")} className="h-9 w-full rounded-lg border bg-card pr-3 pl-8 text-[13px] outline-none focus:border-ring" />
        </div>
        <div className="flex rounded-lg border bg-card p-0.5">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn("rounded-md px-2.5 py-1 text-[12px] font-medium", status === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>{sl[s]}</button>
          ))}
        </div>
        <div className="ml-auto flex rounded-lg border bg-card p-0.5">
          <button onClick={() => setView("grid")} className={cn("rounded-md p-1.5", view === "grid" && "bg-secondary")}><LayoutGrid className="size-4" /></button>
          <button onClick={() => setView("table")} className={cn("rounded-md p-1.5", view === "table" && "bg-secondary")}><List className="size-4" /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((c) => {
            const pct = Math.round((c.kpi.value / c.kpi.target) * 100);
            return (
              <Link key={c.id} to="/campaigns/$id" params={{ id: c.id }} className="group rounded-xl border bg-card p-5 lift hover:border-primary/30">
                <div className="flex items-start justify-between gap-2">
                  <StatusPill status={c.status} />
                  <div className="flex -space-x-1">{c.channels.map((ch) => <ChannelIcon key={ch} channel={ch} size="sm" />)}</div>
                </div>
                <h3 className="mt-3 font-display text-[15px] font-bold leading-snug group-hover:text-primary">{lang === "en" ? c.nameEn : c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.objective} · {c.start.slice(5)} → {c.end.slice(5)}</p>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[12px]"><span className="text-muted-foreground">{c.kpi.label}</span><span className="font-semibold tabular-nums">{c.kpi.value.toLocaleString()} / {c.kpi.target.toLocaleString()}</span></div>
                  <Bar value={pct} />
                </div>
                {c.risk && <p className="mt-3 flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1 text-[11px] text-warning"><AlertTriangle className="size-3" />{c.risk}</p>}
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2"><Avatar who={c.owner} size="sm" />CTA：{c.cta}</span>
                  <span className="tabular-nums">HK${(c.budget / 1000).toFixed(0)}K</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>{[t("名稱", "Name", "名称"), t("狀態", "Status", "状态"), t("目標", "Objective", "目标"), t("日期", "Dates", "日期"), t("負責人", "Owner", "负责人"), "CTA", t("預算", "Budget", "预算")].map((h) => <th key={h} className="px-4 py-2.5">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium"><Link to="/campaigns/$id" params={{ id: c.id }} className="hover:text-primary">{lang === "en" ? c.nameEn : c.name}</Link></td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.objective}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{c.start} → {c.end}</td>
                  <td className="px-4 py-3"><Avatar who={c.owner} size="sm" /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.cta}</td>
                  <td className="px-4 py-3 tabular-nums">HK${c.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <Wizard open={wizard} onOpenChange={setWizard} />
    </div>
  );
}

function Wizard({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [objective, setObjective] = useState("consultation");
  const [channels, setChannels] = useState<string[]>(["linkedin", "email"]);
  const [gen, setGen] = useState<"idle" | "loading" | "done">("idle");
  const steps = [t("目標", "Objective", "目标"), t("受眾", "Audience", "受众"), t("優惠及訊息", "Offer & message", "优惠及信息"), t("渠道", "Channels", "渠道"), t("AI 計劃", "AI plan", "AI 计划")];
  const objectives = [
    ["awareness", t("品牌知名度", "Awareness", "品牌知名度")], ["traffic", t("網站流量", "Traffic", "网站流量")], ["leads", t("潛在客戶", "Lead generation", "潜在客户")],
    ["consultation", t("預約諮詢", "Consultation booking", "预约咨询")], ["event", t("活動報名", "Event registration", "活动报名")], ["retention", t("客戶留存", "Retention", "客户留存")], ["recruit", t("招聘", "Recruitment", "招聘")],
  ];
  const field = "w-full rounded-lg border bg-card px-3 py-2 text-[13px] outline-none focus:border-ring";
  const next = () => {
    if (step === 3) { setStep(4); setGen("loading"); setTimeout(() => setGen("done"), 1800); return; }
    if (step === 4) { onOpenChange(false); setStep(0); setGen("idle"); toast.success(t("已建立草稿活動", "Draft campaign created", "已建立草稿活动")); return; }
    setStep(step + 1);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <div className="border-b p-5">
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">{t("建立新活動", "Create campaign", "建立新活动")}<AiBadge>{t("AI 輔助", "AI-assisted", "AI 辅助")}</AiBadge></DialogTitle>
          <div className="mt-4 flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-1.5">
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition", i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/15 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground")}>{i < step ? <Check className="size-3.5" /> : i + 1}</span>
                <span className={cn("hidden truncate text-[11px] font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                {i < steps.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-[300px] p-5">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {objectives.map(([k, l]) => (
                <button key={k} onClick={() => setObjective(k)} className={cn("rounded-xl border p-3 text-left text-[13px] font-medium transition", objective === k ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-secondary")}>{l}</button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[[t("地區", "Geography", "地区"), "香港"], [t("行業", "Industry", "行业"), "物流、貿易、專業服務"], [t("公司規模", "Company size", "公司规模"), "20–200 人"], [t("職位", "Roles", "职位"), "財務經理、營運總監"], [t("語言", "Languages", "语言"), "廣東話、英文"], [t("排除", "Exclusions", "排除"), "現有客戶"]].map(([l, v]) => (
                <label key={l} className="text-xs font-medium text-muted-foreground">{l}<input defaultValue={v} className={cn(field, "mt-1 text-foreground")} /></label>
              ))}
              <label className="text-xs font-medium text-muted-foreground sm:col-span-2">{t("痛點", "Pain points", "痛点")}<textarea defaultValue="月尾報表要人手整合多個 Excel；老闆問數要等；新同事上手慢。" rows={2} className={cn(field, "mt-1 text-foreground")} /></label>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3">
              {[[t("價值主張", "Value proposition", "价值主张"), "4 星期內將報表流程自動化，唔使換系統。"], [t("證明點", "Proof points", "证明点"), "30 間香港中小企案例；平均每月慳 46 小時。"], ["CTA", "免費預約 30 分鐘 AI 工作流程評估"], [t("免責聲明", "Disclaimers", "免责声明"), "實際節省時間視乎企業流程而定。"]].map(([l, v]) => (
                <label key={l} className="text-xs font-medium text-muted-foreground">{l}<input defaultValue={v} className={cn(field, "mt-1 text-foreground")} /></label>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(["linkedin", "facebook", "instagram", "email", "web"] as const).map((ch) => {
                const on = channels.includes(ch);
                return (
                  <button key={ch} onClick={() => setChannels(on ? channels.filter((x) => x !== ch) : [...channels, ch])} className={cn("flex items-center gap-2.5 rounded-xl border p-3 text-[13px] font-medium transition", on ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-secondary")}>
                    <ChannelIcon channel={ch} />{ch === "web" ? "Website" : ch[0].toUpperCase() + ch.slice(1)}
                    {on && <Check className="ml-auto size-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
          {step === 4 && (gen === "loading" ? (
            <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-ai text-ai-foreground shadow-glow"><Loader2 className="size-6 animate-spin" /></span>
              <p className="font-semibold">{t("正在根據品牌 DNA 生成活動計劃…", "Generating plan from brand DNA…", "正在根据品牌 DNA 生成活动计划…")}</p>
              <p className="text-xs text-muted-foreground">{t("定位 · 內容支柱 · 素材計劃 · 日曆 · KPI · 風險", "Positioning · pillars · assets · calendar · KPIs · risks", "定位 · 内容支柱 · 素材计划 · 日历 · KPI · 风险")}</p>
            </div>
          ) : (
            <div className="grid gap-3 animate-in fade-in duration-500 sm:grid-cols-2">
              {[
                [t("定位", "Positioning", "定位"), "務實本地嘅 AI 工作流程夥伴——唔講大話，只講慳返幾多鐘。"],
                [t("內容支柱", "Content pillars", "内容支柱"), "① 隱藏成本 ② 真實案例 ③ 4 星期方法 ④ 創辦人觀點"],
                [t("素材計劃", "Asset plan", "素材计划"), "8 個 LinkedIn 帖文、4 個輪播、2 段主持人影片、3 封電子報"],
                ["KPI", "80 個預約 · 著陸頁轉化 5% · 150 MQL"],
                [t("風險", "Risks", "风险"), "客戶案例需書面同意；避免「保證」字眼。"],
                [t("實驗", "Experiments", "实验"), "A/B：痛點開頭 vs 數據開頭；12:30 vs 09:30 發佈"],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border bg-surface-2/60 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{l}</p>
                  <p contentEditable suppressContentEditableWarning className="mt-1 text-[13px] leading-relaxed outline-none">{v}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <Button variant="ghost" onClick={() => (step === 0 ? onOpenChange(false) : setStep(step - 1))}>{step === 0 ? t("取消", "Cancel", "取消") : t("上一步", "Back", "上一步")}</Button>
          <Button onClick={next} disabled={gen === "loading"}>
            {step === 3 ? <><Sparkles className="size-4" />{t("生成 AI 計劃", "Generate AI plan", "生成 AI 计划")}</> : step === 4 ? t("建立草稿活動", "Create draft campaign", "建立草稿活动") : t("下一步", "Next", "下一步")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
