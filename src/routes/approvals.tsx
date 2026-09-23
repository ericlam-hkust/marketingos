import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, RotateCcw, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useApp, useT } from "@/lib/app-state";
import { campaigns, people } from "@/lib/mock-data";
import { Avatar, Card, ChannelIcon, EmptyState, PageHeader, Pill, StatusPill, pageHead, channelName } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/approvals")({
  head: () => pageHead("審批中心 Approvals", "Review, approve, request changes or reject content, creative assets and video scripts."),
  component: Approvals,
});

function Approvals() {
  const t = useT();
  const { approvals, decide } = useApp();
  const pending = approvals.filter((a) => a.status === "pending");
  const history = approvals.filter((a) => a.status !== "pending");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const kind = (k: string) => (k === "script" ? t("影片腳本", "Video script", "视频脚本") : k === "asset" ? t("創意素材", "Creative asset", "创意素材") : t("內容", "Content", "内容"));
  const act = (id: string, d: "approved" | "changes" | "rejected") => {
    decide(id, d, notes[id]);
    toast.success(t("已記錄決定並通知提交人", "Decision recorded; requester notified", "已记录决定并通知提交人"));
  };

  return (
    <div>
      <PageHeader title={t("審批中心", "Approval Centre", "审批中心")} sub={t("AI 起草，人類決定。每個決定都會記錄於審計日誌。", "AI drafts, humans decide. Every decision is audit-logged.", "AI 起草，人类决定。每个决定都会记录于审计日志。")}
        actions={<select className="h-9 rounded-lg border bg-card px-2.5 text-[13px]"><option>{t("所有品牌", "All brands", "所有品牌")}</option><option>Tonric 通力</option><option>Tonric Academy</option></select>} />
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">{t("待處理", "Pending", "待处理")}<Pill tone="warning" dot={false}>{pending.length}</Pill></h2>
      {pending.length === 0 ? (
        <EmptyState icon={<Inbox className="size-5" />} title={t("全部處理完畢", "All caught up", "全部处理完毕")} body={t("新的審批請求會喺呢度出現。", "New approval requests will appear here.", "新的审批请求会在这里出现。")} />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {pending.map((a) => (
            <Card key={a.id} className="p-4 lift animate-in fade-in">
              <div className="flex items-start gap-3">
                <ChannelIcon channel={a.channel} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5"><Pill tone={a.kind === "script" ? "ai" : a.kind === "asset" ? "info" : "neutral"} dot={false}>{kind(a.kind)}</Pill><span className="text-[11px] text-muted-foreground">{channelName[a.channel]} · {a.language} · v{a.version}</span></div>
                  {a.kind === "content" && a.targetId !== "li-log-03" ? (
                    <Link to="/content/$id" params={{ id: a.targetId }} className="mt-1.5 block font-semibold hover:text-primary">{a.title}</Link>
                  ) : <p className="mt-1.5 font-semibold">{a.title}</p>}
                  <p className="mt-0.5 text-xs text-muted-foreground">{campaigns.find((c) => c.id === a.campaignId)?.name}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Avatar who={a.submittedBy} size="sm" />{people[a.submittedBy].name} · {a.submittedAt}</div>
                </div>
              </div>
              <input value={notes[a.id] ?? ""} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })} placeholder={t("備註（選填）", "Note (optional)", "备注（选填）")} className="mt-3 h-8 w-full rounded-lg border bg-surface-2/60 px-2.5 text-[12px] outline-none focus:border-ring" />
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => act(a.id, "approved")} className="flex-1"><Check className="size-4" />{t("批准", "Approve", "批准")}</Button>
                <Button size="sm" variant="outline" onClick={() => act(a.id, "changes")} className="flex-1"><RotateCcw className="size-4" />{t("要求修改", "Request changes", "要求修改")}</Button>
                <Button size="sm" variant="ghost" onClick={() => act(a.id, "rejected")} className="text-destructive hover:text-destructive"><X className="size-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <h2 className="mt-8 mb-3 text-sm font-semibold">{t("決定紀錄", "Decision history", "决定记录")}</h2>
      <Card className="divide-y">
        {history.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-5 py-3">
            <ChannelIcon channel={a.channel} size="sm" />
            <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{a.title}</p>{a.note && <p className="truncate text-xs text-muted-foreground">“{a.note}”</p>}</div>
            <span className="text-xs text-muted-foreground">{a.decidedAt}</span>
            <StatusPill status={a.status} />
          </div>
        ))}
      </Card>
    </div>
  );
}
