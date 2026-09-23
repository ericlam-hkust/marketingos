import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { useApp, useT } from "@/lib/app-state";
import { campaigns, type Channel } from "@/lib/mock-data";
import { Avatar, Card, ChannelIcon, PageHeader, StatusPill, pageHead, channelName, Pill } from "@/components/mos/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content/")({
  head: () => pageHead("內容工作室 Content Studio", "Draft, adapt, check and submit multi-channel marketing content in Traditional Chinese and English."),
  component: ContentList,
});

function ContentList() {
  const t = useT();
  const { content } = useApp();
  const [q, setQ] = useState("");
  const [ch, setCh] = useState<Channel | "all">("all");
  const [st, setSt] = useState("all");
  const list = content.filter((c) => (ch === "all" || c.channel === ch) && (st === "all" || c.status === st) && c.title.toLowerCase().includes(q.toLowerCase()));
  const sel = "h-9 rounded-lg border bg-card px-2.5 text-[13px] outline-none";
  const counts = content.reduce<Record<string, number>>((a, c) => ({ ...a, [c.status]: (a[c.status] ?? 0) + 1 }), {});

  return (
    <div>
      <PageHeader title={t("內容工作室", "Content Studio", "内容工作室")} sub={t("以繁體中文撰寫，英文為連結改編版本，永不覆蓋原文。", "Authored in Traditional Chinese; English is a linked adaptation, never an overwrite.", "以繁体中文撰写，英文为链接改编版本，永不覆盖原文。")}
        actions={<><Button variant="outline"><Sparkles className="size-4 text-ai" />{t("AI 起草", "AI draft", "AI 起草")}</Button><Button><Plus className="size-4" />{t("新內容", "New content", "新内容")}</Button></>} />
      <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-6">
        {["DRAFT", "SUBMITTED_FOR_REVIEW", "CHANGES_REQUESTED", "APPROVED", "SCHEDULED", "PUBLISHED"].map((s) => (
          <button key={s} onClick={() => setSt(st === s ? "all" : s)} className={cn("rounded-xl border bg-card p-3 text-left transition hover:border-primary/40", st === s && "border-primary ring-1 ring-primary")}>
            <p className="font-display text-xl font-bold tabular-nums">{counts[s] ?? 0}</p>
            <div className="mt-1"><StatusPill status={s} /></div>
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("搜尋內容", "Search content", "搜索内容")} className="h-9 w-full rounded-lg border bg-card pr-3 pl-8 text-[13px] outline-none focus:border-ring" />
        </div>
        <select value={ch} onChange={(e) => setCh(e.target.value as Channel | "all")} className={sel}>
          <option value="all">{t("所有渠道", "All channels", "所有渠道")}</option>
          {(["linkedin", "facebook", "instagram", "email", "web"] as Channel[]).map((c) => <option key={c} value={c}>{channelName[c]}</option>)}
        </select>
        <select className={sel}><option>{t("所有活動", "All campaigns", "所有活动")}</option>{campaigns.map((c) => <option key={c.id}>{c.name}</option>)}</select>
        <select className={sel}><option>{t("所有語言", "All languages", "所有语言")}</option><option>zh-HK</option><option>en</option></select>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>{[t("標題", "Title", "标题"), t("類型", "Type", "类型"), t("活動", "Campaign", "活动"), t("語言", "Lang", "语言"), t("版本", "Ver", "版本"), t("狀態", "Status", "状态"), t("負責人", "Owner", "负责人"), t("更新", "Updated", "更新")].map((h) => <th key={h} className="px-4 py-2.5">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {list.map((c) => (
              <tr key={c.id} className="group hover:bg-secondary/50">
                <td className="px-4 py-3"><Link to="/content/$id" params={{ id: c.id }} className="flex items-center gap-2.5 font-medium group-hover:text-primary"><ChannelIcon channel={c.channel} size="sm" /><span className="line-clamp-1">{c.title}</span></Link></td>
                <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">{campaigns.find((x) => x.id === c.campaignId)?.name}</td>
                <td className="px-4 py-3"><Pill tone="neutral" dot={false}>{c.language}</Pill></td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">v{c.version}</td>
                <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                <td className="px-4 py-3"><Avatar who={c.owner} size="sm" /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
