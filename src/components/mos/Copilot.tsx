import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Maximize2, Minimize2, X, ArrowUp, Building2, Megaphone, Radio, Languages, UserRound, Layers, FileText, CalendarDays, Target, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, useT, roleLabels, tri } from "@/lib/app-state";
import { ChannelIcon, Pill, StatusPill, Bar, Thumb } from "./ui";
import { campaigns } from "@/lib/mock-data";

type Mode = "ask" | "draft" | "propose" | "execute";
type Artefact =
  | { kind: "options" }
  | { kind: "calendar" }
  | { kind: "approvals" }
  | { kind: "diagnosis" }
  | { kind: "ideas" };
type Msg = { role: "user" | "ai"; text: string; mode?: Mode; artefact?: Artefact; streaming?: boolean };

const seed: Msg[] = [
  { role: "user", text: "幫我為「人手報表」主題寫三個 LinkedIn 帖文方向" },
  {
    role: "ai", mode: "draft", artefact: { kind: "options" },
    text: "已根據 Tonric 通力的品牌語氣（務實、唔硬銷）建立 3 個內容草稿，已存入內容工作室，並連結到「香港中小企 AI 工作流程評估」活動。",
  },
];

function pickReply(q: string): Msg {
  if (/日曆|calendar|四星期|4-week|four/i.test(q))
    return { role: "ai", mode: "propose", artefact: { kind: "calendar" }, text: "我草擬咗一個四星期 LinkedIn + Instagram 日曆（共 12 個帖文）。排期需要你確認後先會生效。" };
  if (/審批|approval|approve/i.test(q))
    return { role: "ai", mode: "ask", artefact: { kind: "approvals" }, text: "今日有 4 項等待你審批，其中 1 項（影片腳本）影響本星期拍攝，建議優先處理。" };
  if (/表現|underperform|點解|why/i.test(q))
    return { role: "ai", mode: "ask", artefact: { kind: "diagnosis" }, text: "「物流業自動化報表方案」Instagram 互動率比目標低 38%。主要原因：素材比例唔啱快拍、發佈時段偏早、CTA 太長。" };
  return { role: "ai", mode: "draft", artefact: { kind: "ideas" }, text: "以下係三個針對物流業中小企嘅活動概念，每個都已建立為草稿活動，可以直接開啟編輯。" };
}

export function CopilotPanel() {
  const { copilotFull, setCopilotFull, setCopilotOpen, role, lang } = useApp();
  const t = useT();
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setInput("");
    const reply = pickReply(text);
    setMsgs((m) => [...m, { role: "user", text }, { ...reply, text: "", streaming: true }]);
    let i = 0;
    const iv = setInterval(() => {
      i += 3;
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { ...reply, text: reply.text.slice(0, i), streaming: i < reply.text.length };
        return copy;
      });
      if (i >= reply.text.length) clearInterval(iv);
    }, 25);
  };

  const prompts = [
    t("幫我諗三個物流中小企活動概念", "Give me three campaign ideas for logistics SMEs", "帮我想三个物流中小企活动概念"),
    t("建立四星期 LinkedIn + Instagram 日曆", "Create a four-week LinkedIn + Instagram calendar", "建立四星期 LinkedIn + Instagram 日历"),
    t("今日有咩要我審批？", "What needs my approval today?", "今天有什么需要我审批？"),
    t("點解呢個活動表現差？", "Why is this campaign underperforming?", "为什么这个活动表现差？"),
  ];

  const chat = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-4 py-2.5">
        <div className="flex flex-wrap gap-1.5">
          {[
            [Building2, "Tonric Group"], [Layers, "Tonric 通力"], [Megaphone, "AI 工作流程評估"],
            [Radio, "LinkedIn"], [Languages, "zh-HK"], [UserRound, tri(lang, roleLabels[role])],
          ].map(([I, l], k) => {
            const Icon = I as typeof Building2;
            return (
              <span key={k} className="group inline-flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground">
                <Icon className="size-3" />{l as string}
                {k === 2 && <X className="size-3 cursor-pointer opacity-50 hover:opacity-100" />}
              </span>
            );
          })}
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex flex-col gap-2", m.role === "user" && "items-end")}>
            {m.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[13px] text-primary-foreground">{m.text}</div>
            ) : (
              <div className="w-full">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-gradient-ai text-ai-foreground"><Sparkles className="size-3.5" /></span>
                  <span className="text-xs font-semibold">Copilot</span>
                  {m.mode && <ModeBadge mode={m.mode} />}
                </div>
                <p className="text-[13px] leading-relaxed">{m.text}{m.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-ai align-middle" />}</p>
                {!m.streaming && m.artefact && <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500"><ArtefactView a={m.artefact} /></div>}
              </div>
            )}
          </div>
        ))}
        {msgs.length <= 2 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("試下問", "Try asking", "试试问")}</p>
            {prompts.map((p) => (
              <button key={p} onClick={() => send(p)} className="block w-full rounded-lg border bg-card px-3 py-2 text-left text-[12px] hover:border-ai/50 hover:bg-ai/5">{p}</button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t p-3">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="ai-border flex items-end gap-2 rounded-xl p-1.5">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={t("用自然語言吩咐 Copilot…", "Ask Copilot in natural language…", "用自然语言吩咐 Copilot…")}
            className="min-h-0 flex-1 resize-none bg-transparent px-2 py-1 text-[13px] outline-none placeholder:text-muted-foreground" />
          <button type="submit" className="grid size-8 place-items-center rounded-lg bg-gradient-ai text-ai-foreground"><ArrowUp className="size-4" /></button>
        </form>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">{t("AI 起草，人類決定 · 發佈前一定會出確認卡", "AI drafts, humans decide · publishing always needs confirmation", "AI 起草，人类决定 · 发布前一定会出确认卡")}</p>
      </div>
    </div>
  );

  return (
    <aside className={cn("flex min-h-0 flex-col border-l bg-surface animate-in slide-in-from-right-4 duration-300", copilotFull ? "flex-1" : "w-[380px] shrink-0")}>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <span className="grid size-7 place-items-center rounded-lg bg-gradient-ai text-ai-foreground shadow-glow"><Sparkles className="size-4" /></span>
        <div className="leading-tight">
          <p className="text-[13px] font-bold">Marketing Copilot</p>
          <p className="text-[10px] text-muted-foreground">{copilotFull ? t("指揮中心", "Command Centre", "指挥中心") : t("品牌 DNA 已載入", "Brand DNA loaded", "品牌 DNA 已加载")}</p>
        </div>
        <div className="ml-auto flex gap-0.5">
          <button onClick={() => setCopilotFull(!copilotFull)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
            {copilotFull ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
          <button onClick={() => { setCopilotFull(false); setCopilotOpen(false); }} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><X className="size-4" /></button>
        </div>
      </div>
      {copilotFull ? (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,1fr)_1.3fr]">
          <div className="min-h-0 border-r">{chat}</div>
          <CommandArtefacts />
        </div>
      ) : chat}
    </aside>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  const t = useT();
  const m = {
    ask: { tone: "neutral" as const, l: t("問答", "Ask", "问答") },
    draft: { tone: "primary" as const, l: t("已起草", "Draft", "已起草") },
    propose: { tone: "ai" as const, l: t("建議 · 待確認", "Propose", "建议 · 待确认") },
    execute: { tone: "success" as const, l: t("已執行", "Execute", "已执行") },
  }[mode];
  return <Pill tone={m.tone}>{m.l}</Pill>;
}

function ArtefactView({ a }: { a: Artefact }) {
  const t = useT();
  if (a.kind === "options" || a.kind === "ideas") {
    const items = a.kind === "options"
      ? [
          { k: "A", title: "46 小時嘅隱藏成本", hook: "每個月底，你的團隊花幾多個鐘喺 Excel 複製貼上？", link: "li-03" },
          { k: "B", title: "老闆問數要等半日", hook: "「上個月毛利幾多？」如果答案要等半日…", link: "ig-car-02" },
          { k: "C", title: "4 星期，唔使換系統", hook: "自動化唔一定要推倒重來。", link: "email-nl-09" },
        ]
      : [
          { k: "A", title: "報表 4 星期自動化挑戰", hook: "目標：預約諮詢 · LinkedIn + 電郵", link: "logistics-auto" },
          { k: "B", title: "葵涌倉庫一日", hook: "目標：知名度 · 短片 + IG", link: "logistics-auto" },
          { k: "C", title: "物流 ROI 計算機", hook: "目標：潛在客戶 · 著陸頁 + 廣告", link: "logistics-auto" },
        ];
    return (
      <div className="space-y-2">
        {items.map((o) => (
          <div key={o.k} className="group rounded-xl border bg-card p-3 transition hover:border-primary/40 hover:shadow-card">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-foreground">{o.k}</span>
              <p className="flex-1 text-[13px] font-semibold">{o.title}</p>
              <StatusPill status={a.kind === "options" ? "DRAFT" : "draft"} />
            </div>
            <p className="mt-1.5 line-clamp-2 text-[12px] text-muted-foreground">{o.hook}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {a.kind === "options" ? (
                <>
                  <Link to="/content/$id" params={{ id: o.link }} className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">{t("開啟編輯器", "Open editor", "打开编辑器")}</Link>
                  <Link to="/assets" className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-secondary">{t("製作輪播", "Create carousel", "制作轮播")}</Link>
                  <Link to="/approvals" className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-secondary">{t("提交審閱", "Submit review", "提交审阅")}</Link>
                </>
              ) : (
                <Link to="/campaigns/$id" params={{ id: o.link }} className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">{t("開啟活動", "Open campaign", "打开活动")}</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (a.kind === "calendar") {
    const weeks = [
      ["LI 痛點帖", "IG 輪播", "LI 案例"],
      ["IG Reel", "LI 數據帖", "IG 快拍"],
      ["LI 創辦人", "IG 輪播", "LI 投票"],
      ["IG Reel", "LI 回顧", "IG CTA"],
    ];
    return (
      <div className="rounded-xl border bg-card p-3">
        <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><CalendarDays className="size-4 text-primary" />{t("四星期日曆草稿", "4-week calendar draft", "四星期日历草稿")}</div>
        <div className="space-y-1.5">
          {weeks.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-semibold text-muted-foreground">W{i + 1}</span>
              {w.map((x) => (
                <span key={x} className={cn("flex-1 truncate rounded-md border-l-2 bg-secondary px-1.5 py-1 text-[10px]", x.startsWith("LI") ? "border-l-ch-linkedin" : "border-l-ch-instagram")}>{x}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-1.5">
          <Link to="/calendar" className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">{t("檢視並確認排期", "Review & confirm", "查看并确认排期")}</Link>
          <button className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-secondary">{t("調整", "Adjust", "调整")}</button>
        </div>
      </div>
    );
  }
  if (a.kind === "approvals") {
    return (
      <div className="space-y-1.5">
        {[
          ["影片腳本 — 創辦人講 AI 誤解", "linkedin", "今日 09:12"],
          ["Instagram 輪播 — 5 個自動化訊號", "instagram", "1 小時前"],
          ["輪播設計 v4 — 人手報表", "linkedin", "2 小時前"],
        ].map(([title, ch, time]) => (
          <Link key={title} to="/approvals" className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5 hover:border-primary/40">
            <ChannelIcon channel={ch as "linkedin"} size="sm" />
            <span className="flex-1 truncate text-[12px] font-medium">{title}</span>
            <span className="text-[10px] text-muted-foreground">{time}</span>
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-xl border bg-card p-3 text-[12px]">
      {[
        ["素材比例 1.91:1 唔適合快拍", 82],
        ["發佈時段 08:00 早過目標受眾活躍時間", 64],
        ["CTA 超過 20 字", 41],
      ].map(([l, v]) => (
        <div key={l as string} className="mb-2.5 last:mb-0">
          <div className="mb-1 flex justify-between"><span>{l}</span><span className="text-muted-foreground">{t("影響", "Impact", "影响")} {v}%</span></div>
          <Bar value={v as number} tone="ai" />
        </div>
      ))}
    </div>
  );
}

function CommandArtefacts() {
  const t = useT();
  const c = campaigns[0];
  return (
    <div className="min-h-0 overflow-y-auto bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("即時活動素材", "Live campaign artefacts", "实时活动素材")}</p>
          <h2 className="font-display text-lg font-bold">{c.name}</h2>
        </div>
        <StatusPill status={c.status} />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><FileText className="size-4 text-primary" />{t("活動簡報", "Brief", "活动简报")}</p>
          <p className="text-[12px] leading-relaxed text-muted-foreground">幫香港 20–200 人中小企搵出最值得自動化嘅報表流程，以免費 30 分鐘評估作為入口。定位：務實、本地、唔使換系統。</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><Target className="size-4 text-primary" />KPI</p>
          <div className="space-y-2 text-[12px]">
            {[["預約數", 42, 80], ["著陸頁轉化", 3.8, 5], ["MQL", 96, 150]].map(([l, v, g]) => (
              <div key={l as string}><div className="mb-1 flex justify-between"><span>{l}</span><span className="tabular-nums text-muted-foreground">{v} / {g}</span></div><Bar value={((v as number) / (g as number)) * 100} /></div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><UserRound className="size-4 text-primary" />{t("受眾分群", "Segments", "受众分群")}</p>
          <div className="flex flex-wrap gap-1.5">
            {["財務經理", "營運總監", "物流業", "貿易業", "20–200 人", "廣東話", "Excel 重度用戶"].map((s) => <Pill key={s} tone="neutral" dot={false}>{s}</Pill>)}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><CalendarDays className="size-4 text-primary" />{t("本週排期", "This week", "本周排期")}</p>
          {[["二 09:30", "LinkedIn 帖文 03", "linkedin", CheckCircle2], ["三 12:00", "IG 輪播", "instagram", Clock], ["五 18:00", "電子報", "email", Clock]].map(([d, l, ch, I]) => {
            const Icon = I as typeof Clock;
            return <div key={l as string} className="flex items-center gap-2 py-1 text-[12px]"><span className="w-14 text-muted-foreground">{d as string}</span><ChannelIcon channel={ch as "email"} size="sm" /><span className="flex-1">{l as string}</span><Icon className="size-3.5 text-muted-foreground" /></div>;
          })}
        </div>
        <div className="rounded-xl border bg-card p-4 xl:col-span-2">
          <p className="mb-3 text-[12px] font-semibold">{t("素材及審批狀態", "Assets & approval", "素材及审批状态")}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[170, "carousel", "in_review"], [55, "image", "approved"], [240, "image", "approved"], [20, "video", "draft"]].map(([h, k, s], i) => (
              <div key={i}><Thumb hue={h as number} kind={k as string} className="aspect-square" /><div className="mt-1.5"><StatusPill status={s as string} /></div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
