import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useT } from "@/lib/app-state";
import { notifications } from "@/lib/mock-data";
import { Card, PageHeader, Pill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => pageHead("通知 Notifications", "Approval, publishing and video production notifications with deep links."),
  component: Notifs,
});

function Notifs() {
  const t = useT();
  const [items, setItems] = useState(notifications);
  return (
    <div>
      <PageHeader title={t("通知", "Notifications", "通知")} actions={<Button variant="outline" onClick={() => setItems(items.map((i) => ({ ...i, unread: false })))}><CheckCheck className="size-4" />{t("全部標為已讀", "Mark all read", "全部标为已读")}</Button>} />
      <Card className="divide-y">
        {items.map((n) => (
          <button key={n.id} onClick={() => setItems(items.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))} className={cn("flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-secondary/40", n.unread && "bg-primary/[0.03]")}>
            <span className={cn("grid size-8 place-items-center rounded-full", n.type.includes("failed") ? "bg-destructive/12 text-destructive" : "bg-secondary text-muted-foreground")}><Bell className="size-4" /></span>
            <div className="flex-1"><p className={cn("text-[13px]", n.unread && "font-semibold")}>{n.title}</p><p className="text-xs text-muted-foreground">{n.time}</p></div>
            <Pill tone="neutral" dot={false} className="font-mono">{n.type}</Pill>
            {n.unread && <span className="size-2 rounded-full bg-primary" />}
          </button>
        ))}
      </Card>
    </div>
  );
}
