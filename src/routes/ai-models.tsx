import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp, useT, tri } from "@/lib/app-state";
import { aiModels } from "@/lib/mock-data";
import { Card, PageHeader, Pill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ai-models")({
  head: () => pageHead("AI 模型 AI Models", "Map each generation profile to a provider model with per-organisation overrides."),
  component: Models,
});

function Models() {
  const t = useT();
  const { lang } = useApp();
  return (
    <div>
      <PageHeader title={t("AI 模型", "AI Models", "AI 模型")} sub={t("每個生成用途對應嘅模型，可按機構覆寫。", "Model per generation profile, overridable per organisation.", "每个生成用途对应的模型，可按机构覆写。")} />
      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-2.5">{t("用途", "Profile", "用途")}</th><th className="px-5 py-2.5">{t("環境預設", "Env default", "环境默认")}</th><th className="px-5 py-2.5">{t("機構覆寫", "Org override", "机构覆写")}</th><th /></tr></thead>
          <tbody className="divide-y">
            {aiModels.map((m) => (
              <tr key={m.profile}>
                <td className="px-5 py-3"><p className="font-medium">{tri(lang, m.label as [string, string, string])}</p><p className="font-mono text-[11px] text-muted-foreground">{m.profile}</p></td>
                <td className="px-5 py-3 font-mono text-[12px] text-muted-foreground">{m.env}</td>
                <td className="px-5 py-3"><input defaultValue={m.override} placeholder="—" className="h-8 w-full max-w-64 rounded-lg border bg-card px-2.5 font-mono text-[12px] outline-none focus:border-ring" /></td>
                <td className="px-5 py-3 text-right">{m.override ? <Pill tone="ai">{t("已覆寫", "Overridden", "已覆写")}</Pill> : <Button size="sm" variant="ghost" onClick={() => toast(t("已儲存", "Saved", "已保存"))}>{t("設定", "Set", "设置")}</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
