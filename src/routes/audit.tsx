import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Loader2, Link2 } from "lucide-react";
import { useT } from "@/lib/app-state";
import { auditLog } from "@/lib/mock-data";
import { Card, PageHeader, Pill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({
  head: () => pageHead("審計日誌 Audit Log", "Hash-chained, append-only event log with on-demand chain verification."),
  component: Audit,
});

function Audit() {
  const t = useT();
  const [v, setV] = useState<"idle" | "run" | number>("idle");
  const verify = () => {
    setV("run");
    let i = 0;
    const iv = setInterval(() => { i++; setV(i); if (i >= auditLog.length) clearInterval(iv); }, 220);
  };
  const done = typeof v === "number" && v >= auditLog.length;
  return (
    <div>
      <PageHeader title={t("審計日誌", "Audit Log", "审计日志")} sub={t("雜湊鏈、只可追加。", "Hash-chained and append-only.", "哈希链、只可追加。")}
        actions={<Button onClick={verify} variant={done ? "outline" : "default"}>{v === "run" || (typeof v === "number" && !done) ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}{done ? t("鏈完整 ✓", "Chain intact ✓", "链完整 ✓") : t("驗證鏈", "Verify chain", "验证链")}</Button>} />
      <Card className="divide-y">
        {auditLog.map((e, i) => {
          const ok = typeof v === "number" && i < v;
          return (
            <div key={e.id} className={cn("flex items-center gap-4 px-5 py-3 transition-colors", ok && "bg-success/5")}>
              <span className={cn("grid size-7 place-items-center rounded-full", ok ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground")}>{ok ? <ShieldCheck className="size-3.5" /> : <Link2 className="size-3.5" />}</span>
              <div className="min-w-0 flex-1"><p className="text-[13px]"><span className="font-semibold">{e.actor}</span> · {e.target}</p><p className="text-xs text-muted-foreground">{e.time}</p></div>
              <Pill tone="neutral" dot={false} className="font-mono">{e.action}</Pill>
              <span className="hidden font-mono text-[11px] text-muted-foreground md:block">{e.hash}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
