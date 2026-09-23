import type { ReactNode } from "react";
import { Linkedin, Facebook, Instagram, Mail, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Channel } from "@/lib/mock-data";
import { people } from "@/lib/mock-data";
import { useApp, useT } from "@/lib/app-state";

type Tone = "success" | "warning" | "destructive" | "info" | "neutral" | "primary" | "ai";

const toneCls: Record<Tone, string> = {
  success: "bg-success/12 text-success ring-success/25",
  warning: "bg-warning/15 text-warning ring-warning/30",
  destructive: "bg-destructive/12 text-destructive ring-destructive/25",
  info: "bg-info/12 text-info ring-info/25",
  neutral: "bg-muted text-muted-foreground ring-border",
  primary: "bg-primary/12 text-primary ring-primary/25",
  ai: "bg-ai/15 text-ai ring-ai/30",
};

export function Pill({ tone = "neutral", children, dot = true, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", toneCls[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const statusMap: Record<string, { tone: Tone; l: [string, string, string] }> = {
  draft: { tone: "neutral", l: ["草稿", "Draft", "草稿"] },
  active: { tone: "success", l: ["進行中", "Active", "进行中"] },
  paused: { tone: "warning", l: ["已暫停", "Paused", "已暂停"] },
  completed: { tone: "info", l: ["已完成", "Completed", "已完成"] },
  archived: { tone: "neutral", l: ["已封存", "Archived", "已归档"] },
  DRAFT: { tone: "neutral", l: ["草稿", "Draft", "草稿"] },
  SUBMITTED_FOR_REVIEW: { tone: "info", l: ["待審閱", "In review", "待审阅"] },
  CHANGES_REQUESTED: { tone: "warning", l: ["需修改", "Changes requested", "需修改"] },
  APPROVED: { tone: "success", l: ["已批准", "Approved", "已批准"] },
  SCHEDULED: { tone: "primary", l: ["已排期", "Scheduled", "已排期"] },
  PUBLISHED: { tone: "success", l: ["已發佈", "Published", "已发布"] },
  pending: { tone: "warning", l: ["待決定", "Pending", "待决定"] },
  approved: { tone: "success", l: ["已批准", "Approved", "已批准"] },
  changes: { tone: "warning", l: ["需修改", "Changes requested", "需修改"] },
  rejected: { tone: "destructive", l: ["已拒絕", "Rejected", "已拒绝"] },
  in_review: { tone: "info", l: ["審閱中", "In review", "审阅中"] },
  published: { tone: "success", l: ["已發佈", "Published", "已发布"] },
  scheduled: { tone: "primary", l: ["已排期", "Scheduled", "已排期"] },
  failed: { tone: "destructive", l: ["失敗", "Failed", "失败"] },
  ready: { tone: "info", l: ["就緒", "Ready", "就绪"] },
  publishing: { tone: "info", l: ["發佈中", "Publishing", "发布中"] },
  cancelled: { tone: "neutral", l: ["已取消", "Cancelled", "已取消"] },
  succeeded: { tone: "success", l: ["成功", "Succeeded", "成功"] },
  running: { tone: "info", l: ["執行中", "Running", "运行中"] },
  queued: { tone: "neutral", l: ["排隊中", "Queued", "排队中"] },
  new: { tone: "neutral", l: ["新", "New", "新"] },
  mql: { tone: "info", l: ["MQL", "MQL", "MQL"] },
  sql: { tone: "primary", l: ["SQL", "SQL", "SQL"] },
  meeting: { tone: "ai", l: ["會議", "Meeting", "会议"] },
  opportunity: { tone: "success", l: ["商機", "Opportunity", "商机"] },
  disqualified: { tone: "destructive", l: ["不合資格", "Disqualified", "不合格"] },
};

export function StatusPill({ status }: { status: string }) {
  const t = useT();
  const s = statusMap[status] ?? { tone: "neutral" as Tone, l: [status, status, status] as [string, string, string] };
  return <Pill tone={s.tone}>{t(...s.l)}</Pill>;
}

const chIcon = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, email: Mail, web: Globe };
const chBg: Record<Channel, string> = {
  linkedin: "bg-ch-linkedin", facebook: "bg-ch-facebook", instagram: "bg-ch-instagram", email: "bg-ch-email", web: "bg-ch-web",
};
export const chText: Record<Channel, string> = {
  linkedin: "text-ch-linkedin", facebook: "text-ch-facebook", instagram: "text-ch-instagram", email: "text-ch-email", web: "text-ch-web",
};
export const chBorder: Record<Channel, string> = {
  linkedin: "border-l-ch-linkedin", facebook: "border-l-ch-facebook", instagram: "border-l-ch-instagram", email: "border-l-ch-email", web: "border-l-ch-web",
};
export const channelName: Record<Channel, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram", email: "Email", web: "Website",
};

export function ChannelIcon({ channel, size = "md" }: { channel: Channel; size?: "sm" | "md" }) {
  const I = chIcon[channel];
  return (
    <span className={cn("inline-grid shrink-0 place-items-center rounded-md text-primary-foreground", chBg[channel], size === "sm" ? "size-5" : "size-7")}>
      <I className={size === "sm" ? "size-3" : "size-3.5"} />
    </span>
  );
}

export function Avatar({ who, size = "md" }: { who: keyof typeof people; size?: "sm" | "md" }) {
  const p = people[who];
  return (
    <span title={p.name} className={cn("inline-grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-accent-foreground ring-2 ring-background", size === "sm" ? "size-6 text-[10px]" : "size-8 text-xs")}>
      {p.initials}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground", className)}>{children}</div>;
}

export function CardHeader({ title, icon, action, sub }: { title: ReactNode; icon?: ReactNode; action?: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
      <div className="flex items-center gap-2.5">
        {icon && <span className="grid size-7 place-items-center rounded-lg bg-secondary text-muted-foreground">{icon}</span>}
        <div>
          <h3 className="text-[13px] font-semibold">{title}</h3>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, sub, actions, eyebrow }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  const { brand } = useApp();
  const t = useT();
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {eyebrow ?? (brand === "tonric" ? "Tonric 通力" : brand === "tonric-academy" ? "Tonric Academy" : "Harbour Logistics")}
          <span>·</span>
          <span>{t("香港時間", "HKT", "香港时间")}</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-secondary text-muted-foreground">{icon}</span>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AiBadge({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-ai px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ai-foreground">
      <Sparkles className="size-3" />
      {children ?? "AI"}
    </span>
  );
}

export function Stat({ label, value, delta, up = true }: { label: string; value: string; delta?: string; up?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-bold tabular-nums">{value}</p>
      {delta && <p className={cn("text-xs font-medium", up ? "text-success" : "text-destructive")}>{up ? "▲" : "▼"} {delta}</p>}
    </div>
  );
}

export function Ring({ value, size = 44, stroke = 5, className }: { value: number; size?: number; stroke?: number; className?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className={cn("-rotate-90", className)}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(value, 100) / 100)} className="stroke-primary transition-all duration-700" />
    </svg>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "warning" | "destructive" | "ai" }) {
  const bg = { primary: "bg-primary", warning: "bg-warning", destructive: "bg-destructive", ai: "bg-gradient-ai" }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all duration-700", bg)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export function Thumb({ hue, kind, className }: { hue: number; kind: string; className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ background: `linear-gradient(135deg, oklch(0.78 0.1 ${hue}), oklch(0.5 0.14 ${(hue + 40) % 360}))` }}
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0 2px, transparent 3px)", backgroundSize: "22px 22px" }} />
      <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
        <div className="h-2 w-3/4 rounded-full bg-white/80" />
        <div className="h-2 w-1/2 rounded-full bg-white/60" />
      </div>
      {kind === "carousel" && (
        <div className="absolute top-2 right-2 flex gap-0.5">
          {[0, 1, 2, 3].map((i) => <span key={i} className={cn("size-1.5 rounded-full", i === 0 ? "bg-white" : "bg-white/50")} />)}
        </div>
      )}
      {kind === "video" && <div className="absolute inset-0 grid place-items-center"><span className="grid size-10 place-items-center rounded-full bg-white/85 text-lg">▶</span></div>}
    </div>
  );
}

export function pageHead(title: string, description: string) {
  const full = `${title} · Tonric MarketingOS`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
