import { createFileRoute } from "@tanstack/react-router";
import { useApp, useT, type Lang } from "@/lib/app-state";
import { Card, PageHeader, pageHead } from "@/components/mos/ui";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => pageHead("個人設定 Profile", "Display name, interface language, timezone, theme and accessibility preferences."),
  component: Profile,
});

function Profile() {
  const t = useT();
  const { lang, setLang, theme, toggleTheme } = useApp();
  const field = "mt-1 h-9 w-full rounded-lg border bg-card px-3 text-[13px] outline-none focus:border-ring";
  return (
    <div className="max-w-2xl">
      <PageHeader title={t("個人設定", "Profile", "个人设置")} />
      <Card className="space-y-4 p-6">
        <label className="block text-xs font-medium text-muted-foreground">{t("顯示名稱", "Display name", "显示名称")}<input className={field} defaultValue="林家豪 Eric Lam" /></label>
        <label className="block text-xs font-medium text-muted-foreground">{t("介面語言", "UI language", "界面语言")}
          <select className={field} value={lang} onChange={(e) => setLang(e.target.value as Lang)}><option value="hk">繁體中文（香港）</option><option value="en">English</option><option value="cn">简体中文</option></select>
        </label>
        <label className="block text-xs font-medium text-muted-foreground">{t("時區", "Timezone", "时区")}<select className={field}><option>Asia/Hong_Kong (HKT)</option><option>Asia/Shanghai</option><option>Asia/Singapore</option></select></label>
        <div className="divide-y rounded-xl border">
          {[[t("深色主題", "Dark theme", "深色主题"), theme === "dark", toggleTheme], [t("緊湊密度", "Compact density", "紧凑密度"), false], [t("減少動畫", "Reduce motion", "减少动画"), false], [t("高對比", "High contrast", "高对比")]].map(([l, v, fn]) => (
            <div key={l as string} className="flex items-center justify-between px-4 py-3 text-[13px]"><span>{l as string}</span><Switch defaultChecked={!!v} onCheckedChange={fn as (() => void) | undefined} /></div>
          ))}
        </div>
        <Button>{t("儲存", "Save", "保存")}</Button>
      </Card>
    </div>
  );
}
