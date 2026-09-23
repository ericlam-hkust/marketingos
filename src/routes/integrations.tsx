import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Linkedin, Facebook, Instagram, BarChart3, Mail, Database, RefreshCw, Plug } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/app-state";
import { Card, PageHeader, Pill, pageHead } from "@/components/mos/ui";
import { ConfirmCard } from "@/components/mos/ConfirmCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/integrations")({
  head: () => pageHead("整合 Integrations", "Provider OAuth apps and channel connections for LinkedIn, Facebook and Instagram."),
  component: Integrations,
});

function Integrations() {
  const t = useT();
  const [confirm, setConfirm] = useState(false);
  const field = "mt-1 h-9 w-full rounded-lg border bg-card px-3 text-[13px] outline-none focus:border-ring";
  return (
    <div>
      <PageHeader title={t("整合", "Integrations", "集成")} sub={t("只用 OAuth 連接——永不要求密碼。", "Connect via OAuth only — never passwords.", "只用 OAuth 连接——永不要求密码。")} />
      <h2 className="mb-3 text-sm font-semibold">{t("供應商應用程式", "Provider apps", "供应商应用")}</h2>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {[{ n: "LinkedIn", I: Linkedin, s: t("已為此機構設定", "Configured for this organisation", "已为此机构设置"), tone: "success" as const }, { n: "Meta (Facebook + Instagram)", I: Facebook, s: t("未設定 — 測試模擬", "Not configured — staging mock", "未设置 — 测试模拟"), tone: "warning" as const }].map((p) => (
          <Card key={p.n} className="p-5">
            <div className="mb-4 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-secondary"><p.I className="size-5" /></span><p className="flex-1 font-semibold">{p.n}</p><Pill tone={p.tone}>{p.s}</Pill></div>
            <label className="block text-xs font-medium text-muted-foreground">Client ID<input className={field} defaultValue={p.tone === "success" ? "86x9k2tonric" : ""} /></label>
            <label className="mt-3 block text-xs font-medium text-muted-foreground">Client secret<input type="password" className={field} placeholder={t("留空保留現有", "Leave blank to keep existing", "留空保留现有")} /></label>
            <label className="mt-3 block text-xs font-medium text-muted-foreground">Redirect URI<input readOnly className={`${field} font-mono text-[11px]`} value="https://os.tonric.hk/oauth/callback" /></label>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{t("請喺供應商控制台登記此網址。", "Register this URL in the provider console.", "请在供应商控制台登记此网址。")}</p>
          </Card>
        ))}
      </div>
      <h2 className="mb-3 text-sm font-semibold">{t("渠道連接", "Channel connections", "渠道连接")}</h2>
      <div className="mb-8 grid gap-3 lg:grid-cols-3">
        {[{ I: Linkedin, n: "Tonric LinkedIn 公司專頁", h: "healthy", sc: "w_organization_social, r_basicprofile" }, { I: Facebook, n: "Tonric Facebook 專頁", h: "healthy", sc: "pages_manage_posts" }, { I: Instagram, n: "@tonric.hk", h: "degraded", sc: "instagram_content_publish" }].map((c) => (
          <Card key={c.n} className="p-4">
            <div className="flex items-center gap-2.5"><c.I className="size-5" /><p className="flex-1 truncate text-[13px] font-semibold">{c.n}</p><Pill tone={c.h === "healthy" ? "success" : "warning"}>{c.h === "healthy" ? t("正常", "Healthy", "正常") : t("需注意", "Degraded", "需注意")}</Pill></div>
            <p className="mt-2 font-mono text-[10.5px] text-muted-foreground">{c.sc}</p>
            <select className="mt-3 h-8 w-full rounded-lg border bg-card px-2 text-[12px]"><option>Tonric 通力</option><option>{t("所有品牌", "All brands", "所有品牌")}</option></select>
            <div className="mt-3 flex gap-1.5">
              <Button size="sm" variant="outline" onClick={() => toast.success(t("連接測試成功", "Connection test passed", "连接测试成功"))}>{t("測試", "Test", "测试")}</Button>
              <Button size="sm" variant="outline"><RefreshCw className="size-3.5" /></Button>
              <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => setConfirm(true)}>{t("中斷", "Disconnect", "断开")}</Button>
            </div>
          </Card>
        ))}
      </div>
      <h2 className="mb-3 text-sm font-semibold">{t("即將推出", "Coming soon", "即将推出")}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {[[BarChart3, "Google Analytics"], [Mail, "Email"], [Database, "CRM"]].map(([I, n]) => {
          const Icon = I as typeof Plug;
          return <Card key={n as string} className="flex items-center gap-3 border-dashed p-4 opacity-60"><Icon className="size-5" /><span className="text-[13px] font-medium">{n as string}</span><Pill tone="neutral" className="ml-auto">{t("即將推出", "Soon", "即将推出")}</Pill></Card>;
        })}
      </div>
      <ConfirmCard open={confirm} onOpenChange={setConfirm} payload={{ action: "disconnect", channel: "instagram", account: "@tonric.hk", campaign: t("所有活動", "All campaigns", "所有活动"), content: t("3 個已排期帖文會暫停", "3 scheduled posts will pause", "3 个已排期帖文会暂停") }} />
    </div>
  );
}
