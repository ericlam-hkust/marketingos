import { useState } from "react";
import { CheckCircle2, Clock, ShieldCheck, Link2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/app-state";
import { ChannelIcon, Thumb } from "./ui";
import type { Channel } from "@/lib/mock-data";

export type ConfirmPayload = {
  action: "schedule" | "publish" | "reschedule" | "cancel" | "send" | "delete" | "disconnect";
  channel: Channel;
  account: string;
  campaign: string;
  content: string;
  asset?: string;
  time?: string;
  copy?: string;
};

const actionL: Record<ConfirmPayload["action"], [string, string, string, string, string, string]> = {
  schedule: ["我已準備好排期此項目。", "I am ready to schedule this item.", "我已准备好排期此项目。", "確認排期", "Confirm schedule", "确认排期"],
  publish: ["我已準備好立即發佈。", "I am ready to publish now.", "我已准备好立即发布。", "確認發佈", "Confirm publish", "确认发布"],
  reschedule: ["我要更改此項目的排期。", "I want to reschedule this item.", "我要更改此项目的排期。", "確認更改", "Confirm reschedule", "确认更改"],
  cancel: ["我要取消此排期。", "I want to cancel this schedule.", "我要取消此排期。", "確認取消", "Confirm cancel", "确认取消"],
  send: ["我已準備好發送此外展訊息。", "I am ready to send this outreach.", "我已准备好发送此外展信息。", "確認發送", "Confirm send", "确认发送"],
  delete: ["我要刪除此項目。", "I want to delete this item.", "我要删除此项目。", "確認刪除", "Confirm delete", "确认删除"],
  disconnect: ["我要中斷此連接。", "I want to disconnect this integration.", "我要断开此连接。", "確認中斷", "Confirm disconnect", "确认断开"],
};

export function ConfirmCard({ open, onOpenChange, payload, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void; payload: ConfirmPayload; onConfirm?: () => void;
}) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const a = actionL[payload.action];
  const rows: [string, string][] = [
    [t("渠道", "Channel", "渠道"), payload.account],
    [t("活動", "Campaign", "活动"), payload.campaign],
    [t("內容", "Content", "内容"), payload.content],
    ...(payload.asset ? [[t("素材", "Asset", "素材"), payload.asset] as [string, string]] : []),
    ...(payload.time ? [[t("排期時間", "Scheduled time", "排期时间"), payload.time] as [string, string]] : []),
  ];
  const confirm = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onOpenChange(false);
      onConfirm?.();
      toast.success(t("已確認並記錄於審計日誌", "Confirmed and recorded in the audit log", "已确认并记录于审计日志"));
    }, 700);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        <div className="grid md:grid-cols-[1fr_300px]">
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-4" />{t("確認卡", "Confirmation card", "确认卡")}
            </div>
            <DialogTitle className="font-display text-xl font-bold">{t(a[0], a[1], a[2])}</DialogTitle>
            <DialogDescription className="mt-1">{t("只有按下確認才會執行。請核對以下所有資料。", "Only the confirm button executes. Please verify everything below.", "只有按下确认才会执行。请核对以下所有资料。")}</DialogDescription>
            <dl className="mt-5 divide-y rounded-xl border">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center gap-4 px-4 py-2.5 text-[13px]">
                  <dt className="w-24 shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 text-[13px]">
                <span className="inline-flex items-center gap-1.5 font-medium text-success"><CheckCircle2 className="size-4" />{t("狀態：已批准", "Status: Approved", "状态：已批准")}</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-success"><Link2 className="size-4" />{t("UTM 連結：已包含", "UTM link: Included", "UTM 链接：已包含")}</span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="size-4" />Asia/Hong_Kong</span>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={confirm} disabled={busy} variant={payload.action === "delete" || payload.action === "disconnect" || payload.action === "cancel" ? "destructive" : "default"} className="min-w-36">
                {busy ? t("處理中…", "Working…", "处理中…") : t(a[3], a[4], a[5])}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}><Pencil className="size-4" />{t("編輯", "Edit", "编辑")}</Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("取消", "Cancel", "取消")}</Button>
            </div>
          </div>
          <div className="border-t bg-surface-2 p-5 md:border-t-0 md:border-l">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("渠道原生預覽", "Native channel preview", "渠道原生预览")}</p>
            <div className="rounded-xl border bg-card p-3 shadow-card">
              <div className="flex items-center gap-2">
                <ChannelIcon channel={payload.channel} />
                <div className="leading-tight">
                  <p className="text-xs font-semibold">Tonric 通力</p>
                  <p className="text-[10px] text-muted-foreground">{payload.time ?? t("立即", "Now", "立即")} · 🌐</p>
                </div>
              </div>
              <p className="mt-2 line-clamp-6 whitespace-pre-line text-[12px] leading-relaxed">{payload.copy ?? payload.content}</p>
              <Thumb hue={170} kind="carousel" className="mt-2 aspect-[4/3]" />
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>👍 讚好</span><span>💬 留言</span><span>↗ 分享</span></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
