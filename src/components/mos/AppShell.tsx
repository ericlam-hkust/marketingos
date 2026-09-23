import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Megaphone, PenLine, Images, Clapperboard, CheckCircle2, CalendarDays, Users,
  Plug, Send, Cog, ScrollText, Cpu, Palette, Search, Bell, Sun, Moon, Languages, ChevronsLeft,
  ChevronsRight, Sparkles, ChevronDown, LogOut, UserCircle, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, useT, canAccess, roleLabels, tri, type Role, type Lang } from "@/lib/app-state";
import { brands, notifications } from "@/lib/mock-data";
import { CopilotPanel } from "./Copilot";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/", key: "dashboard", icon: LayoutDashboard, l: ["總覽", "Dashboard", "总览"] },
  { to: "/campaigns", key: "campaigns", icon: Megaphone, l: ["營銷活動", "Campaigns", "营销活动"] },
  { to: "/content", key: "content", icon: PenLine, l: ["內容工作室", "Content Studio", "内容工作室"] },
  { to: "/assets", key: "assets", icon: Images, l: ["素材庫", "Asset Library", "素材库"] },
  { to: "/videos", key: "videos", icon: Clapperboard, l: ["影片製作", "Videos", "视频制作"] },
  { to: "/approvals", key: "approvals", icon: CheckCircle2, l: ["審批中心", "Approvals", "审批中心"], badge: true },
  { to: "/calendar", key: "calendar", icon: CalendarDays, l: ["內容日曆", "Calendar", "内容日历"] },
  { to: "/leads", key: "leads", icon: Users, l: ["潛在客戶", "Leads", "潜在客户"] },
  { section: ["營運", "Operations", "运营"] },
  { to: "/publishing", key: "publishing", icon: Send, l: ["發佈", "Publishing", "发布"] },
  { to: "/integrations", key: "integrations", icon: Plug, l: ["整合", "Integrations", "集成"] },
  { to: "/jobs", key: "jobs", icon: Cog, l: ["背景工作", "Jobs", "后台任务"] },
  { to: "/audit", key: "audit", icon: ScrollText, l: ["審計日誌", "Audit Log", "审计日志"] },
  { to: "/ai-models", key: "ai-models", icon: Cpu, l: ["AI 模型", "AI Models", "AI 模型"] },
  { to: "/brands", key: "brands", icon: Palette, l: ["品牌中心", "Brand Hub", "品牌中心"] },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { copilotOpen, copilotFull } = useApp();
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          {!copilotFull && (
            <main className="min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1400px] px-6 py-7 lg:px-8">{children}</div>
            </main>
          )}
          {(copilotOpen || copilotFull) && <CopilotPanel />}
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const { sidebarCollapsed: c, setSidebarCollapsed, role, lang, approvals } = useApp();
  const t = useT();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const pending = approvals.filter((a) => a.status === "pending").length;
  return (
    <aside className={cn("hidden shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-300 md:flex", c ? "w-[68px]" : "w-[232px]")}>
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-card">
          <span className="font-display text-sm font-extrabold">T</span>
        </div>
        {!c && (
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">Tonric</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">MarketingOS</p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {nav.map((n, i) => {
          if ("section" in n) return !c ? <p key={i} className="px-2.5 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{tri(lang, n.section as unknown as [string, string, string])}</p> : <div key={i} className="my-3 border-t" />;
          if (!canAccess(role, n.key)) return null;
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          const I = n.icon;
          return (
            <Link key={n.to} to={n.to} title={tri(lang, n.l as unknown as [string, string, string])}
              className={cn("group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
              {active && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />}
              <I className={cn("size-[17px] shrink-0", active && "text-primary")} />
              {!c && <span className="truncate">{tri(lang, n.l as unknown as [string, string, string])}</span>}
              {"badge" in n && pending > 0 && (
                <span className={cn("grid min-w-5 place-items-center rounded-full bg-warning px-1.5 text-[10px] font-bold text-ai-foreground", c ? "absolute -top-0.5 right-0.5 h-4 min-w-4 px-1" : "ml-auto h-5")}>{pending}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        {!c && (
          <div className="mb-2 rounded-lg bg-hero p-3 ring-1 ring-border">
            <p className="flex items-center gap-1.5 text-xs font-semibold"><Sparkles className="size-3.5 text-ai" />{t("AI 起草，人類決定", "AI drafts, humans decide", "AI 起草，人类决定")}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{t("所有發佈動作都需要確認卡。", "Every publish action needs a confirmation card.", "所有发布动作都需要确认卡。")}</p>
          </div>
        )}
        <button onClick={() => setSidebarCollapsed(!c)} className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent">
          {c ? <ChevronsRight className="size-4" /> : <><ChevronsLeft className="size-4" />{t("收起", "Collapse", "收起")}</>}
        </button>
      </div>
    </aside>
  );
}

const langs: { id: Lang; label: string }[] = [
  { id: "hk", label: "繁體中文" }, { id: "en", label: "English" }, { id: "cn", label: "简体中文" },
];

function TopBar() {
  const { theme, toggleTheme, lang, setLang, role, setRole, brand, setBrand, copilotOpen, setCopilotOpen, copilotFull } = useApp();
  const t = useT();
  const unread = notifications.filter((n) => n.unread).length;
  const b = brands.find((x) => x.id === brand)!;
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-left text-[13px] hover:bg-secondary">
          <span className="size-3 rounded-full ring-2 ring-background" style={{ background: b.color }} />
          <span className="hidden text-muted-foreground sm:inline">Tonric Group /</span>
          <span className="font-semibold">{b.name}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>{t("切換品牌", "Switch brand", "切换品牌")}</DropdownMenuLabel>
          {brands.filter((x) => x.status === "active").map((x) => (
            <DropdownMenuItem key={x.id} onClick={() => setBrand(x.id)} className="gap-2">
              <span className="size-3 rounded-full" style={{ background: x.color }} />
              <span className="flex-1">{x.name}</span>
              {x.id === brand && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <button className="ml-auto flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border bg-card px-3 text-[13px] text-muted-foreground hover:border-ring/40 md:ml-4 md:mr-auto">
        <Search className="size-4" />
        <span className="truncate">{t("搜尋活動、內容、客戶…", "Search campaigns, content, leads…", "搜索活动、内容、客户…")}</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 text-[10px] font-medium sm:inline">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Language">
            <Languages className="size-[18px]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {langs.map((l) => (
              <DropdownMenuItem key={l.id} onClick={() => setLang(l.id)} className="gap-2">
                <span className="flex-1">{l.label}</span>
                {lang === l.id && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={toggleTheme} aria-label="Theme" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
          {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </button>
        <Link to="/notifications" aria-label="Notifications" className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Bell className="size-[18px]" />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">{unread}</span>}
        </Link>
        {!copilotFull && (
          <button onClick={() => setCopilotOpen(!copilotOpen)}
            className={cn("ml-1 flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition", copilotOpen ? "bg-secondary text-foreground" : "bg-gradient-ai text-ai-foreground shadow-glow")}>
            <Sparkles className="size-4" />
            <span className="hidden lg:inline">Copilot</span>
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-secondary">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">EL</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <p className="font-semibold">林家豪 Eric Lam</p>
              <p className="text-xs font-normal text-muted-foreground">{tri(lang, roleLabels[role])}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] font-medium text-muted-foreground">{t("預覽角色", "Preview as role", "预览角色")}</DropdownMenuLabel>
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRole(r)} className="gap-2 text-[13px]">
                <span className="flex-1">{tri(lang, roleLabels[r])}</span>
                {r === role && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile" className="gap-2"><UserCircle className="size-4" />{t("個人設定", "Profile settings", "个人设置")}</Link></DropdownMenuItem>
            <DropdownMenuItem className="gap-2"><LogOut className="size-4" />{t("登出", "Sign out", "退出登录")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
