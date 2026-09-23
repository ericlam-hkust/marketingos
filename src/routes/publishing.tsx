import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ExternalLink, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/app-state";
import { publishQueue } from "@/lib/mock-data";
import { Card, ChannelIcon, PageHeader, StatusPill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publishing")({
  head: () => pageHead("發佈 Publishing", "Publishing items, status machine, attempt history and idempotent retries."),
  component: Publishing,
});

function Publishing() {
  const t = useT();
  const [open, setOpen] = useState<string | null>("p3");
  const [fixed, setFixed] = useState(false);
  const machine = ["DRAFT", "READY", "SCHEDULED", "PUBLISHING", "PUBLISHED"];
  return (
    <div>
      <PageHeader title={t("發佈", "Publishing", "发布")} sub={t("所有重試均為冪等，永不重複發佈。", "All retries are idempotent — never double-post.", "所有重试均为幂等，永不重复发布。")} />
      <Card className="mb-5 flex flex-wrap items-center gap-2 p-4">
        {machine.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-1 font-mono text-[11px] font-semibold">{s}</span>
            {i < machine.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
        <span className="ml-2 text-muted-foreground">|</span>
        <span className="rounded-md bg-destructive/10 px-2 py-1 font-mono text-[11px] font-semibold text-destructive">FAILED</span>→
        <span className="rounded-md bg-warning/15 px-2 py-1 font-mono text-[11px] font-semibold text-warning">RETRY_PENDING</span>
      </Card>
      <Card className="divide-y overflow-hidden">
        {publishQueue.map((p) => {
          const status = p.id === "p3" && fixed ? "scheduled" : p.status;
          return (
            <div key={p.id}>
              <button onClick={() => setOpen(open === p.id ? null : p.id)} className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-secondary/40">
                <ChannelIcon channel={p.channel} />
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{p.title}</p><p className="text-xs text-muted-foreground">{p.account}</p></div>
                <span className="hidden text-xs tabular-nums text-muted-foreground md:block">{p.time}</span>
                <StatusPill status={status} />
                <ChevronDown className={cn("size-4 text-muted-foreground transition", open === p.id && "rotate-180")} />
              </button>
              {open === p.id && (
                <div className="grid gap-4 bg-surface-2/50 px-5 py-4 text-[12.5px] md:grid-cols-3 animate-in fade-in">
                  <div><p className="text-xs text-muted-foreground">{t("遠端連結", "Remote URL", "远端链接")}</p>{p.url ? <a href={p.url} className="flex items-center gap-1 text-primary">{t("開啟帖文", "Open post", "打开帖文")}<ExternalLink className="size-3" /></a> : "—"}</div>
                  <div><p className="text-xs text-muted-foreground">UTM</p><p className="truncate font-mono text-[11px]">?utm_source={p.channel}&utm_campaign=hk-sme-ai</p></div>
                  <div><p className="text-xs text-muted-foreground">{t("嘗試次數", "Attempts", "尝试次数")}</p><p>{p.attempts}</p></div>
                  {p.error && !fixed && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 md:col-span-3">
                      <p className="text-xs font-semibold text-destructive">{t("嘗試 #2 失敗 · 11:15", "Attempt #2 failed · 11:15", "尝试 #2 失败 · 11:15")}</p>
                      <p className="mt-1 font-mono text-[11px]">{p.error}</p>
                      <Button size="sm" variant="destructive" className="mt-3" onClick={() => { setFixed(true); toast.success(t("已加入重試隊列（冪等鍵 pub_p3_v4）", "Queued retry (idempotency key pub_p3_v4)", "已加入重试队列（幂等键 pub_p3_v4）")); }}><RotateCcw className="size-3.5" />{t("重試", "Retry", "重试")}</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
