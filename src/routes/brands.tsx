import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Star, Sparkles, Archive } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/app-state";
import { brands } from "@/lib/mock-data";
import { Card, PageHeader, Pill, pageHead } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/brands")({
  head: () => pageHead("品牌中心 Brand Hub", "Brand identity, tone, approved claims and banned phrases that steer every AI draft."),
  component: Brands,
});

function Brands() {
  const t = useT();
  const [sel, setSel] = useState("tonric");
  const b = brands.find((x) => x.id === sel)!;
  const Tags = ({ items, tone }: { items: string[]; tone: "neutral" | "success" | "destructive" }) => (
    <div className="flex flex-wrap gap-1.5">{items.map((i) => <Pill key={i} tone={tone} dot={false}>{i}</Pill>)}<button className="rounded-full border border-dashed px-2 text-[11px] text-muted-foreground">+</button></div>
  );
  return (
    <div>
      <PageHeader title={t("品牌中心", "Brand Hub", "品牌中心")} sub={t("呢度嘅規則會引導每一份 AI 草稿。", "These rules steer every AI draft.", "这里的规则会引导每一份 AI 草稿。")} actions={<Button><Plus className="size-4" />{t("新品牌", "New brand", "新品牌")}</Button>} />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {brands.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={cn("rounded-xl border bg-card p-4 text-left lift", sel === x.id && "border-primary ring-1 ring-primary", x.status === "archived" && "opacity-60")}>
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-xl shadow-card" style={{ background: x.color }} />
              <div className="flex-1"><p className="font-semibold">{x.name}</p><p className="text-xs text-muted-foreground">{x.desc}</p></div>
            </div>
            <div className="mt-3 flex gap-1.5">{x.isDefault && <Pill tone="primary"><Star className="size-3" />{t("預設", "Default", "默认")}</Pill>}<Pill tone={x.status === "active" ? "success" : "neutral"}>{x.status === "active" ? t("使用中", "Active", "使用中") : t("已封存", "Archived", "已归档")}</Pill></div>
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-hero p-4 ring-1 ring-border">
        <Sparkles className="size-5 text-ai" />
        <p className="text-[13px]"><span className="font-semibold">{t("品牌 DNA", "Brand DNA", "品牌 DNA")}：</span>{t(`${b.name} 嘅所有規則會注入到每次 AI 生成。`, `All of ${b.name}'s rules are injected into every AI generation.`, `${b.name} 的所有规则会注入到每次 AI 生成。`)}</p>
        <div className="ml-auto flex gap-2">
          {!b.isDefault && <Button size="sm" variant="outline">{t("設為預設", "Set as default", "设为默认")}</Button>}
          <Button size="sm" variant="ghost" onClick={() => b.isDefault ? toast.error(t("唔可以封存預設品牌", "Can't archive the default brand", "不能归档默认品牌")) : toast(t("已封存", "Archived", "已归档"))}><Archive className="size-4" /></Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <Field l={t("定位", "Positioning", "定位")} v="香港中小企最務實嘅 AI 工作流程夥伴。" />
          <Field l={t("語氣規則", "Tone rules", "语气规则")} v="講廣東話口語、務實、用數字說話、唔硬銷、唔誇大。" />
          <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">{t("價值主張", "Value propositions", "价值主张")}</p><Tags items={["4 星期見效", "唔使換系統", "本地團隊支援"]} tone="neutral" /></div>
          <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">{t("核准 CTA", "Approved CTAs", "核准 CTA")}</p><Tags items={["免費預約評估", "下載案例", "立即報名"]} tone="neutral" /></div>
          <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">{t("核准聲稱", "Approved claims", "核准声称")}</p><Tags items={["30+ 香港客戶", "平均慳 46 小時/月"]} tone="success" /></div>
          <div><p className="mb-1.5 text-xs font-semibold text-destructive">{t("禁止聲稱", "PROHIBITED claims", "禁止声称")}</p><Tags items={["保證回本", "100% 準確", "取代員工"]} tone="destructive" /></div>
          <div><p className="mb-1.5 text-xs font-semibold text-destructive">{t("禁用詞", "Banned phrases", "禁用词")}</p><Tags items={["保證", "零成本", "革命性", "顛覆"]} tone="destructive" /></div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("中英詞彙表", "zh-HK / EN glossary", "中英词汇表")}</p>
            <div className="divide-y rounded-lg border text-[13px]">{[["工作流程", "workflow"], ["自動化", "automation"], ["評估", "assessment"], ["中小企", "SME"]].map(([a, b2]) => <div key={a} className="grid grid-cols-2 px-3 py-2"><span>{a}</span><span className="text-muted-foreground">{b2}</span></div>)}</div>
          </Card>
          <Card className="p-5">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("視覺識別", "Visual identity", "视觉识别")}</p>
            <div className="flex gap-4">
              {[["Primary", b.color], ["Secondary", "oklch(0.72 0.16 55)"]].map(([n, c]) => <div key={n}><span className="block size-14 rounded-xl ring-1 ring-border" style={{ background: c }} /><p className="mt-1 text-[11px] font-medium">{n}</p></div>)}
              <div className="flex-1 space-y-1 text-[12.5px]"><p><span className="text-muted-foreground">{t("標題字體", "Heading", "标题字体")}：</span>Plus Jakarta Sans</p><p><span className="text-muted-foreground">{t("內文字體", "Body", "正文字体")}：</span>Noto Sans TC</p><p><span className="text-muted-foreground">{t("指引", "Guidelines", "指引")}：</span><span className="text-primary">brand.tonric.hk</span></p></div>
            </div>
          </Card>
          <Card className="p-5"><p className="mb-2 text-xs font-semibold text-muted-foreground">{t("目標人物及行業", "Personas & industries", "目标人物及行业")}</p><Tags items={["財務經理", "營運總監", "物流", "貿易", "專業服務"]} tone="neutral" /></Card>
        </div>
      </div>
    </div>
  );
}

function Field({ l, v }: { l: string; v: string }) {
  return <div><p className="mb-1 text-xs font-semibold text-muted-foreground">{l}</p><p contentEditable suppressContentEditableWarning className="rounded-lg border bg-surface-2/50 px-3 py-2 text-[13px] outline-none focus:border-ring">{v}</p></div>;
}
