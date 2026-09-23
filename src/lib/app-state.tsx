import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { approvals as seedApprovals, contentItems as seedContent, type Approval, type ContentItem } from "./mock-data";

export type Lang = "hk" | "en" | "cn";
export type Theme = "light" | "dark";
export type Role =
  | "platform_admin"
  | "marketing_director"
  | "campaign_manager"
  | "content_marketer"
  | "designer"
  | "analyst"
  | "approver"
  | "sales_user"
  | "client_viewer";

export const roleLabels: Record<Role, [string, string, string]> = {
  platform_admin: ["平台管理員", "Platform admin", "平台管理员"],
  marketing_director: ["市場總監", "Marketing director", "市场总监"],
  campaign_manager: ["活動經理", "Campaign manager", "活动经理"],
  content_marketer: ["內容營銷", "Content marketer", "内容营销"],
  designer: ["設計師", "Designer", "设计师"],
  analyst: ["分析師", "Analyst", "分析师"],
  approver: ["審批人", "Approver", "审批人"],
  sales_user: ["銷售", "Sales user", "销售"],
  client_viewer: ["客戶檢視", "Client viewer", "客户查看"],
};

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  role: Role;
  setRole: (r: Role) => void;
  brand: string;
  setBrand: (b: string) => void;
  copilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  copilotFull: boolean;
  setCopilotFull: (v: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  approvals: Approval[];
  decide: (id: string, decision: Approval["status"], note?: string) => void;
  content: ContentItem[];
  setContentStatus: (id: string, status: ContentItem["status"]) => void;
};

const Ctx = createContext<State | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("hk");
  const [theme, setTheme] = useState<Theme>("light");
  const [role, setRole] = useState<Role>("marketing_director");
  const [brand, setBrand] = useState("tonric");
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [copilotFull, setCopilotFull] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>(seedApprovals);
  const [content, setContent] = useState<ContentItem[]>(seedContent);

  useEffect(() => {
    const l = localStorage.getItem("mos-lang") as Lang | null;
    if (l) setLangS(l);
    const t = localStorage.getItem("mos-theme") as Theme | null;
    if (t) setTheme(t);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    if (window.innerWidth < 1280) setCopilotOpen(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = lang === "hk" ? "zh-HK" : lang === "cn" ? "zh-CN" : "en";
  }, [theme, lang]);

  const setLang = useCallback((l: Lang) => {
    setLangS(l);
    localStorage.setItem("mos-lang", l);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const n = t === "dark" ? "light" : "dark";
      localStorage.setItem("mos-theme", n);
      return n;
    });
  }, []);

  const decide = useCallback((id: string, decision: Approval["status"], note?: string) => {
    setApprovals((a) =>
      a.map((x) => (x.id === id ? { ...x, status: decision, note, decidedAt: "剛剛" } : x)),
    );
  }, []);
  const setContentStatus = useCallback((id: string, status: ContentItem["status"]) => {
    setContent((c) => c.map((x) => (x.id === id ? { ...x, status } : x)));
  }, []);

  const value = useMemo(
    () => ({
      lang, setLang, theme, toggleTheme, role, setRole, brand, setBrand,
      copilotOpen, setCopilotOpen, copilotFull, setCopilotFull,
      sidebarCollapsed, setSidebarCollapsed, approvals, decide, content, setContentStatus,
    }),
    [lang, setLang, theme, toggleTheme, role, brand, copilotOpen, copilotFull, sidebarCollapsed, approvals, decide, content, setContentStatus],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

/** Translate helper: t("繁中", "English", "简中") */
export function useT() {
  const { lang } = useApp();
  return useCallback(
    (hk: string, en: string, cn?: string) => (lang === "en" ? en : lang === "cn" ? cn ?? hk : hk),
    [lang],
  );
}

export function tri(lang: Lang, v: [string, string, string]) {
  return lang === "en" ? v[1] : lang === "cn" ? v[2] : v[0];
}

export function canAccess(role: Role, module: string) {
  const deny: Partial<Record<Role, string[]>> = {
    content_marketer: ["integrations", "ai-models", "audit", "jobs", "brands"],
    designer: ["leads", "integrations", "ai-models", "audit", "jobs"],
    sales_user: ["content", "assets", "videos", "integrations", "ai-models", "audit", "jobs", "brands", "publishing"],
    analyst: ["integrations", "ai-models"],
    approver: ["integrations", "ai-models", "jobs"],
    client_viewer: ["leads", "integrations", "ai-models", "audit", "jobs", "brands", "publishing", "videos"],
  };
  return !(deny[role] ?? []).includes(module);
}
