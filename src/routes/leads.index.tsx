import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, ShieldOff, ShieldCheck, ShieldAlert, ArrowRight, Flame, ThermometerSun, Snowflake } from "lucide-react";
import { useT } from "@/lib/app-state";
import { leads, funnel } from "@/lib/mock-data";
import { Avatar, Card, PageHeader, StatusPill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { useApp, tri } from "@/lib/app-state";

export const Route = createFileRoute("/leads/")({
  head: () => pageHead("潛在客戶 Leads", "CRM-lite lead list with consent enforcement, pipeline status and suppression management."),
  component: Leads,
});

function Leads() {
  const t = useT();
  const { lang } = useApp();
  return (
    <div>
      <PageHeader title={t("潛在客戶及外展", "Leads & outreach", "潜在客户及外展")} sub={t("只會向已同意、未被封鎖嘅客戶起草外展訊息。", "Outreach drafts only for opted-in, unsuppressed leads.", "只会向已同意、未被屏蔽的客户起草外展信息。")}
        actions={<><Button variant="outline"><ShieldOff className="size-4" />{t("封鎖名單", "Suppression list", "屏蔽名单")}</Button><Button><Upload className="size-4" />{t("匯入 CSV", "Import CSV", "导入 CSV")}</Button></>} />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {funnel.map((f, i) => (
          <Card key={i} className="p-3.5"><p className="text-xs text-muted-foreground">{tri(lang, f.stage as [string, string, string])}</p><p className="font-display text-2xl font-bold tabular-nums">{f.value}</p></Card>
        ))}
      </div>
      <div className="grid gap-3 md:hidden">
        {leads.map((lead) => <MobileLeadCard key={lead.id} lead={lead} />)}
      </div>
      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>{[t("姓名", "Name", "姓名"), t("公司", "Company", "公司"), t("來源", "Source", "来源"), t("同意", "Consent", "同意"), t("評分", "Score", "评分"), t("狀態", "Status", "状态"), t("負責人", "Owner", "负责人")].map((h) => <th key={h} className="px-4 py-2.5">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((l) => (
              <tr key={l.id} className="group hover:bg-secondary/50">
                <td className="px-4 py-3"><Link to="/leads/$id" params={{ id: l.id }} className="flex items-center gap-2.5 group-hover:text-primary"><span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{l.name.slice(0, 1)}</span><span><span className="block font-medium">{l.name}</span><span className="text-xs text-muted-foreground">{l.title}</span></span></Link></td>
                <td className="px-4 py-3 text-muted-foreground">{l.company}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.source}</td>
                <td className="px-4 py-3">{l.consent ? <ShieldCheck className="size-4 text-success" /> : <ShieldAlert className="size-4 text-warning" />}</td>
                <td className="min-w-40 px-4 py-3"><LeadScore score={l.score} /></td>
                <td className="px-4 py-3"><StatusPill status={l.status} /></td>
                <td className="px-4 py-3"><Avatar who={l.owner} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function scoreMeta(score: number) {
  if (score >= 80) return { tone: "bg-success", text: "text-success", label: ["高意向", "Hot", "高意向"], Icon: Flame } as const;
  if (score >= 55) return { tone: "bg-warning", text: "text-warning", label: ["培育中", "Warm", "培育中"], Icon: ThermometerSun } as const;
  return { tone: "bg-info", text: "text-info", label: ["低意向", "Cold", "低意向"], Icon: Snowflake } as const;
}

function LeadScore({ score }: { score: number }) {
  const t = useT();
  const meta = scoreMeta(score);
  return <div className="w-full" aria-label={`${t("潛在客戶評分", "Lead score", "潜在客户评分")} ${score} / 100`}>
    <div className="mb-1.5 flex items-center justify-between gap-3"><span className="font-display text-sm font-bold tabular-nums">{score}</span><span className={`flex items-center gap-1 text-[10px] font-semibold ${meta.text}`}><meta.Icon className="size-3" />{t(meta.label[0], meta.label[1], meta.label[2])}</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all duration-700 ${meta.tone}`} style={{ width: `${score}%` }} /></div>
  </div>;
}

function MobileLeadCard({ lead }: { lead: (typeof leads)[number] }) {
  const t = useT();
  return <Link to="/leads/$id" params={{ id: lead.id }} className="rounded-lg border bg-card p-4 transition hover:border-primary/30">
    <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{lead.name.slice(0, 1)}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{lead.name}</p><p className="truncate text-xs text-muted-foreground">{lead.title} · {lead.company}</p></div><ArrowRight className="size-4 shrink-0 text-muted-foreground" /></div><div className="mt-3"><LeadScore score={lead.score} /></div><div className="mt-3 flex items-center justify-between"><StatusPill status={lead.status} /><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{lead.consent ? <ShieldCheck className="size-3.5 text-success" /> : <ShieldAlert className="size-3.5 text-warning" />}{lead.consent ? t("已同意聯絡", "Opted in", "已同意联系") : t("未同意", "No consent", "未同意")}</span></div></div></div>
  </Link>;
}
