import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, ShieldOff, ShieldCheck, ShieldAlert } from "lucide-react";
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
      <div className="mb-5 grid grid-cols-5 gap-3">
        {funnel.map((f, i) => (
          <Card key={i} className="p-3.5"><p className="text-xs text-muted-foreground">{tri(lang, f.stage as [string, string, string])}</p><p className="font-display text-2xl font-bold tabular-nums">{f.value}</p></Card>
        ))}
      </div>
      <Card className="overflow-hidden">
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
                <td className="px-4 py-3"><span className="inline-flex items-center gap-2 tabular-nums"><span className="h-1.5 w-12 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-primary" style={{ width: `${l.score}%` }} /></span>{l.score}</span></td>
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
