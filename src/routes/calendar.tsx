import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useT } from "@/lib/app-state";
import { calendarEntries, type Channel } from "@/lib/mock-data";
import { Card, ChannelIcon, PageHeader, StatusPill, pageHead, chBorder, channelName } from "@/components/mos/ui";
import { ConfirmCard } from "@/components/mos/ConfirmCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => pageHead("內容日曆 Calendar", "Month, week and day views of every scheduled post across channels, with confirmation-gated scheduling."),
  component: CalendarPage,
});

type Entry = (typeof calendarEntries)[number];

function CalendarPage() {
  const t = useT();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [filter, setFilter] = useState<Channel | "all">("all");
  const [confirm, setConfirm] = useState<{ e: Entry; action: "reschedule" | "cancel" | "schedule" } | null>(null);
  const entries = calendarEntries.filter((e) => filter === "all" || e.channel === filter);
  const days = Array.from({ length: 35 }, (_, i) => i - 1); // Sep 2026 starts Tue
  const wd = [t("一", "Mon", "一"), t("二", "Tue", "二"), t("三", "Wed", "三"), t("四", "Thu", "四"), t("五", "Fri", "五"), t("六", "Sat", "六"), t("日", "Sun", "日")];

  const EntryChip = ({ e }: { e: Entry }) => (
    <Popover>
      <PopoverTrigger className={cn("w-full truncate rounded-md border-l-2 bg-secondary/70 px-1.5 py-1 text-left text-[10.5px] font-medium hover:bg-secondary", chBorder[e.channel], e.status === "failed" && "bg-destructive/10 text-destructive")}>
        <span className="tabular-nums text-muted-foreground">{e.time}</span> {e.title}
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex items-center gap-2"><ChannelIcon channel={e.channel} /><div><p className="text-[13px] font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{channelName[e.channel]} · Tonric</p></div></div>
        <div className="mt-3 flex items-center justify-between text-xs"><span className="text-muted-foreground">9/{e.day} {e.time} HKT</span><StatusPill status={e.status} /></div>
        {e.status === "scheduled" && (
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirm({ e, action: "reschedule" })}>{t("改期", "Reschedule", "改期")}</Button>
            <Button size="sm" variant="ghost" className="flex-1 text-destructive" onClick={() => setConfirm({ e, action: "cancel" })}>{t("取消", "Cancel", "取消")}</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );

  return (
    <div>
      <PageHeader title={t("內容日曆", "Calendar", "内容日历")} sub={t("排期、改期及取消都需要確認卡。", "Scheduling, rescheduling and cancelling all require a confirmation card.", "排期、改期及取消都需要确认卡。")}
        actions={<Button onClick={() => setConfirm({ e: calendarEntries[10], action: "schedule" })}><Plus className="size-4" />{t("排期已批准內容", "Schedule approved item", "排期已批准内容")}</Button>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button className="grid size-8 place-items-center rounded-lg border bg-card"><ChevronLeft className="size-4" /></button>
          <span className="px-2 font-display text-base font-bold">{t("2026 年 9 月", "September 2026", "2026 年 9 月")}</span>
          <button className="grid size-8 place-items-center rounded-lg border bg-card"><ChevronRight className="size-4" /></button>
        </div>
        <div className="flex gap-1.5">
          {(["all", "linkedin", "facebook", "instagram", "email", "web"] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium", filter === c ? "border-primary bg-primary/10 text-primary" : "bg-card text-muted-foreground")}>
              {c !== "all" && <ChannelIcon channel={c} size="sm" />}{c === "all" ? t("全部", "All", "全部") : channelName[c]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex rounded-lg border bg-card p-0.5 text-[12px] font-medium">
          {(["month", "week", "day"] as const).map((v) => <button key={v} onClick={() => setView(v)} className={cn("rounded-md px-3 py-1", view === v ? "bg-secondary" : "text-muted-foreground")}>{v === "month" ? t("月", "Month", "月") : v === "week" ? t("週", "Week", "周") : t("日", "Day", "日")}</button>)}
        </div>
      </div>

      {view === "month" && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-surface-2 text-center text-[11px] font-semibold text-muted-foreground">{wd.map((d) => <div key={d} className="py-2">{d}</div>)}</div>
          <div className="grid grid-cols-7">
            {days.map((d, i) => {
              const valid = d >= 1 && d <= 30;
              const es = entries.filter((e) => e.day === d);
              return (
                <div key={i} className={cn("min-h-28 border-r border-b p-1.5 last:border-r-0", !valid && "bg-muted/30", d === 23 && "bg-primary/5")}>
                  {valid && <p className={cn("mb-1 text-[11px] font-semibold", d === 23 ? "inline-grid size-5 place-items-center rounded-full bg-primary text-primary-foreground" : "text-muted-foreground")}>{d}</p>}
                  <div className="space-y-1">{es.map((e, k) => <EntryChip key={k} e={e} />)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      {view !== "month" && (
        <Card className="overflow-hidden">
          <div className={cn("grid", view === "week" ? "grid-cols-7" : "grid-cols-1")}>
            {(view === "week" ? [21, 22, 23, 24, 25, 26, 27] : [23]).map((d, i) => (
              <div key={d} className="min-h-[420px] border-r p-2 last:border-r-0">
                <p className={cn("mb-2 text-center text-xs font-semibold", d === 23 && "text-primary")}>{view === "week" ? wd[i] : ""} 9/{d}</p>
                <div className="space-y-1.5">{entries.filter((e) => e.day === d).map((e, k) => <EntryChip key={k} e={e} />)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {confirm && (
        <ConfirmCard open onOpenChange={(v) => !v && setConfirm(null)}
          payload={{ action: confirm.action, channel: confirm.e.channel, account: `Tonric ${channelName[confirm.e.channel]}`, campaign: "香港中小企 AI 工作流程評估", content: confirm.e.title, time: `9/${confirm.e.day} ${confirm.e.time} HKT` }} />
      )}
    </div>
  );
}
