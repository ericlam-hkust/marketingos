import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/app-state";
import { jobs } from "@/lib/mock-data";
import { Card, PageHeader, StatusPill, pageHead } from "@/components/mos/ui";

export const Route = createFileRoute("/jobs")({
  head: () => pageHead("背景工作 Jobs", "Background job run history by queue, status and duration."),
  component: Jobs,
});

function Jobs() {
  const t = useT();
  return (
    <div>
      <PageHeader title={t("背景工作", "Jobs", "后台任务")} sub={t("只顯示本機構嘅工作紀錄。", "Tenant-isolated job history.", "只显示本机构的任务记录。")} />
      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><tr>{["ID", t("隊列", "Queue", "队列"), t("狀態", "Status", "状态"), t("時長", "Duration", "时长"), t("開始", "Started", "开始"), t("錯誤", "Error", "错误")].map((h) => <th key={h} className="px-5 py-2.5">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {jobs.map((j) => (
              <tr key={j.id}><td className="px-5 py-3 font-mono text-[12px]">{j.id}</td><td className="px-5 py-3 font-mono text-[12px]">{j.queue}</td><td className="px-5 py-3"><StatusPill status={j.status} /></td><td className="px-5 py-3 tabular-nums">{j.duration}</td><td className="px-5 py-3 text-muted-foreground">{j.started}</td><td className="px-5 py-3 text-[12px] text-destructive">{j.error ?? ""}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
