export type Channel = "linkedin" | "facebook" | "instagram" | "email" | "web";

export const brands = [
  { id: "tonric", name: "Tonric 通力", color: "oklch(0.56 0.12 170)", isDefault: true, status: "active", desc: "香港中小企 AI 工作流程顧問" },
  { id: "tonric-academy", name: "Tonric Academy", color: "oklch(0.72 0.16 55)", isDefault: false, status: "active", desc: "企業 AI 培訓課程" },
  { id: "harbour", name: "Harbour Logistics", color: "oklch(0.6 0.13 240)", isDefault: false, status: "archived", desc: "物流客戶品牌（代理）" },
];

export const people = {
  eric: { name: "林家豪 Eric", initials: "EL" },
  mandy: { name: "陳美詩 Mandy", initials: "MC" },
  kelvin: { name: "黃俊傑 Kelvin", initials: "KW" },
  ivy: { name: "李詠欣 Ivy", initials: "IL" },
  sam: { name: "張浩然 Sam", initials: "SC" },
};

export type Campaign = {
  id: string;
  name: string;
  nameEn: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  objective: string;
  start: string;
  end: string;
  owner: keyof typeof people;
  cta: string;
  budget: number;
  spent: number;
  kpi: { label: string; value: number; target: number };
  readiness: number;
  risk?: string;
  channels: Channel[];
};

export const campaigns: Campaign[] = [
  {
    id: "hk-sme-ai", name: "香港中小企 AI 工作流程評估", nameEn: "HK SME AI Workflow Assessment",
    status: "active", objective: "預約諮詢", start: "2026-09-01", end: "2026-10-31", owner: "mandy",
    cta: "免費預約 30 分鐘評估", budget: 120000, spent: 58400, kpi: { label: "預約數", value: 42, target: 80 },
    readiness: 86, channels: ["linkedin", "instagram", "email"],
  },
  {
    id: "logistics-auto", name: "物流業自動化報表方案", nameEn: "Logistics Reporting Automation",
    status: "active", objective: "潛在客戶", start: "2026-09-10", end: "2026-11-15", owner: "kelvin",
    cta: "下載案例研究", budget: 80000, spent: 51200, kpi: { label: "潛在客戶", value: 118, target: 200 },
    readiness: 72, risk: "Instagram 互動率低於目標 38%", channels: ["linkedin", "facebook", "web"],
  },
  {
    id: "ai-academy-q4", name: "Q4 企業 AI 培訓課程招生", nameEn: "Q4 Corporate AI Academy Enrolment",
    status: "draft", objective: "活動報名", start: "2026-10-15", end: "2026-12-10", owner: "ivy",
    cta: "立即報名", budget: 60000, spent: 0, kpi: { label: "報名", value: 0, target: 150 },
    readiness: 41, channels: ["email", "facebook", "instagram"],
  },
  {
    id: "retail-cny", name: "零售業農曆新年數碼轉型", nameEn: "Retail CNY Digital Transformation",
    status: "paused", objective: "品牌知名度", start: "2026-08-01", end: "2026-09-30", owner: "sam",
    cta: "了解更多", budget: 45000, spent: 30100, kpi: { label: "觸及", value: 184000, target: 250000 },
    readiness: 90, risk: "預算已用 67%，進度落後", channels: ["facebook", "instagram"],
  },
  {
    id: "summer-webinar", name: "夏季 AI 網上研討會", nameEn: "Summer AI Webinar Series",
    status: "completed", objective: "活動報名", start: "2026-06-01", end: "2026-08-15", owner: "mandy",
    cta: "重溫錄影", budget: 30000, spent: 28900, kpi: { label: "報名", value: 412, target: 350 },
    readiness: 100, channels: ["linkedin", "email"],
  },
];

export type ContentStatus = "DRAFT" | "SUBMITTED_FOR_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "SCHEDULED" | "PUBLISHED";

export type ContentItem = {
  id: string;
  title: string;
  type: string;
  channel: Channel;
  campaignId: string;
  language: "zh-HK" | "en";
  version: number;
  status: ContentStatus;
  owner: keyof typeof people;
  updated: string;
  body: string;
  bodyEn: string;
};

export const contentItems: ContentItem[] = [
  {
    id: "li-03", title: "LinkedIn 帖文 03 — 人手報表的隱藏成本", type: "LinkedIn 帖文", channel: "linkedin",
    campaignId: "hk-sme-ai", language: "zh-HK", version: 4, status: "APPROVED", owner: "mandy", updated: "10 分鐘前",
    body: "每個月底，你的團隊花幾多個鐘頭喺 Excel 度複製貼上？\n\n我哋同 30 間香港中小企傾過，平均每間公司每月花 46 小時做人手報表。呢啲時間本來可以用嚟跟進客戶、諗新策略。\n\n好消息係：大部分報表流程可以喺 4 星期內自動化，唔需要換系統。\n\n👉 免費預約 30 分鐘 AI 工作流程評估，睇下你間公司可以慳返幾多時間。",
    bodyEn: "At every month-end, how many hours does your team spend copy-pasting in Excel?\n\nWe spoke with 30 Hong Kong SMEs — on average each spends 46 hours a month on manual reporting. That's time that could go to clients and strategy.\n\nThe good news: most reporting workflows can be automated within 4 weeks, without replacing your systems.\n\n👉 Book a free 30-minute AI workflow assessment and see how much time you could save.",
  },
  {
    id: "ig-car-02", title: "Instagram 輪播 — 5 個自動化訊號", type: "Instagram 輪播", channel: "instagram",
    campaignId: "hk-sme-ai", language: "zh-HK", version: 2, status: "SUBMITTED_FOR_REVIEW", owner: "ivy", updated: "1 小時前",
    body: "你間公司需要自動化嘅 5 個訊號 👇\n1️⃣ 同一份資料要輸入 3 次\n2️⃣ 報表永遠遲交\n3️⃣ 新同事要學 2 星期先識做\n4️⃣ 老闆問數要等半日\n5️⃣ 月尾全組加班",
    bodyEn: "5 signs your business needs automation 👇\n1️⃣ Same data typed in 3 times\n2️⃣ Reports always late\n3️⃣ New hires need 2 weeks to learn\n4️⃣ Answering the boss takes half a day\n5️⃣ Whole team works late at month-end",
  },
  {
    id: "email-nl-09", title: "九月電子報 — AI 工作流程實戰", type: "電子報", channel: "email",
    campaignId: "hk-sme-ai", language: "zh-HK", version: 1, status: "DRAFT", owner: "mandy", updated: "3 小時前",
    body: "親愛的 {{first_name}}，\n\n今個月我哋整理咗 3 個真實案例，睇下香港企業點樣用 AI 慳返每星期 10 小時……",
    bodyEn: "Dear {{first_name}},\n\nThis month we've gathered 3 real cases of how Hong Kong businesses save 10 hours a week with AI…",
  },
  {
    id: "fb-log-01", title: "Facebook 帖文 — 物流報表 4 星期自動化", type: "Facebook 帖文", channel: "facebook",
    campaignId: "logistics-auto", language: "zh-HK", version: 3, status: "SCHEDULED", owner: "kelvin", updated: "昨日",
    body: "物流公司每日處理幾百張單，報表點可以仲靠人手？我哋幫一間葵涌物流公司將每日報表由 3 小時減到 5 分鐘。",
    bodyEn: "Logistics firms handle hundreds of orders daily — why are reports still manual? We cut a Kwai Chung logistics firm's daily report from 3 hours to 5 minutes.",
  },
  {
    id: "li-log-02", title: "LinkedIn 帖文 — 案例研究：葵涌物流", type: "LinkedIn 帖文", channel: "linkedin",
    campaignId: "logistics-auto", language: "zh-HK", version: 2, status: "CHANGES_REQUESTED", owner: "kelvin", updated: "昨日",
    body: "【案例研究】葵涌物流點樣喺 4 星期內實現報表自動化？",
    bodyEn: "[Case study] How a Kwai Chung logistics firm automated reporting in 4 weeks",
  },
  {
    id: "web-lp-01", title: "著陸頁 — 免費 AI 評估", type: "著陸頁", channel: "web",
    campaignId: "hk-sme-ai", language: "zh-HK", version: 5, status: "PUBLISHED", owner: "sam", updated: "3 日前",
    body: "用 30 分鐘，搵出你公司最值得自動化嘅 3 個流程。",
    bodyEn: "In 30 minutes, find the 3 workflows in your company most worth automating.",
  },
  {
    id: "vid-01", title: "主持人影片 — 創辦人講 AI 誤解", type: "主持人影片", channel: "linkedin",
    campaignId: "hk-sme-ai", language: "zh-HK", version: 1, status: "DRAFT", owner: "ivy", updated: "5 日前",
    body: "（影片腳本已鎖定）", bodyEn: "(Script locked)",
  },
];

export type Approval = {
  id: string;
  targetId: string;
  title: string;
  kind: "content" | "asset" | "script";
  channel: Channel;
  language: string;
  version: number;
  campaignId: string;
  submittedBy: keyof typeof people;
  submittedAt: string;
  status: "pending" | "approved" | "changes" | "rejected";
  note?: string;
  decidedAt?: string;
};

export const approvals: Approval[] = [
  { id: "ap1", targetId: "ig-car-02", title: "Instagram 輪播 — 5 個自動化訊號", kind: "content", channel: "instagram", language: "zh-HK", version: 2, campaignId: "hk-sme-ai", submittedBy: "ivy", submittedAt: "1 小時前", status: "pending" },
  { id: "ap2", targetId: "asset-car-v4", title: "輪播設計 v4 — 人手報表", kind: "asset", channel: "linkedin", language: "zh-HK", version: 4, campaignId: "hk-sme-ai", submittedBy: "sam", submittedAt: "2 小時前", status: "pending" },
  { id: "ap3", targetId: "vp-founder", title: "影片腳本 — 創辦人講 AI 誤解", kind: "script", channel: "linkedin", language: "zh-HK", version: 3, campaignId: "hk-sme-ai", submittedBy: "ivy", submittedAt: "今日 09:12", status: "pending" },
  { id: "ap4", targetId: "li-log-03", title: "LinkedIn 帖文 — 物流 ROI 計算機", kind: "content", channel: "linkedin", language: "en", version: 1, campaignId: "logistics-auto", submittedBy: "kelvin", submittedAt: "昨日 17:40", status: "pending" },
  { id: "ap5", targetId: "li-03", title: "LinkedIn 帖文 03 — 人手報表的隱藏成本", kind: "content", channel: "linkedin", language: "zh-HK", version: 4, campaignId: "hk-sme-ai", submittedBy: "mandy", submittedAt: "昨日", status: "approved", decidedAt: "昨日 18:02", note: "CTA 清晰，可以排期。" },
  { id: "ap6", targetId: "li-log-02", title: "LinkedIn 帖文 — 案例研究：葵涌物流", kind: "content", channel: "linkedin", language: "zh-HK", version: 2, campaignId: "logistics-auto", submittedBy: "kelvin", submittedAt: "2 日前", status: "changes", decidedAt: "昨日 11:20", note: "需要客戶書面同意先可以用公司名。" },
];

export const publishQueue = [
  { id: "p1", title: "LinkedIn 帖文 03 — 人手報表", channel: "linkedin" as Channel, account: "Tonric LinkedIn 公司專頁", time: "今日 09:30", status: "published", url: "https://linkedin.com/feed/update/1", attempts: 1 },
  { id: "p2", title: "Facebook — 物流報表 4 星期自動化", channel: "facebook" as Channel, account: "Tonric Facebook 專頁", time: "今日 12:00", status: "scheduled", attempts: 0 },
  { id: "p3", title: "Instagram 快拍 — 評估倒數", channel: "instagram" as Channel, account: "@tonric.hk", time: "今日 11:15", status: "failed", error: "Media aspect ratio 1.91:1 not supported for Stories (需要 9:16)", attempts: 2 },
  { id: "p4", title: "電子報 — 九月 AI 實戰", channel: "email" as Channel, account: "newsletter@tonric.hk", time: "今日 18:00", status: "scheduled", attempts: 0 },
  { id: "p5", title: "LinkedIn — 物流 ROI 計算機", channel: "linkedin" as Channel, account: "Tonric LinkedIn 公司專頁", time: "明日 09:30", status: "ready", attempts: 0 },
];

export const performance = [
  { d: "9/10", reach: 12400, engagement: 820, clicks: 310, leads: 12 },
  { d: "9/11", reach: 13800, engagement: 910, clicks: 342, leads: 15 },
  { d: "9/12", reach: 11200, engagement: 760, clicks: 290, leads: 9 },
  { d: "9/13", reach: 9800, engagement: 640, clicks: 250, leads: 8 },
  { d: "9/14", reach: 15600, engagement: 1120, clicks: 410, leads: 19 },
  { d: "9/15", reach: 17900, engagement: 1340, clicks: 488, leads: 22 },
  { d: "9/16", reach: 16400, engagement: 1210, clicks: 452, leads: 18 },
  { d: "9/17", reach: 18800, engagement: 1480, clicks: 530, leads: 24 },
  { d: "9/18", reach: 21200, engagement: 1620, clicks: 590, leads: 27 },
  { d: "9/19", reach: 19600, engagement: 1510, clicks: 548, leads: 23 },
  { d: "9/20", reach: 14200, engagement: 980, clicks: 380, leads: 14 },
  { d: "9/21", reach: 22800, engagement: 1790, clicks: 640, leads: 31 },
  { d: "9/22", reach: 24500, engagement: 1920, clicks: 702, leads: 34 },
  { d: "9/23", reach: 26100, engagement: 2080, clicks: 756, leads: 38 },
];

export type Lead = {
  id: string; name: string; company: string; title: string; email: string; source: string;
  consent: boolean; status: "new" | "mql" | "sql" | "meeting" | "opportunity" | "disqualified";
  owner: keyof typeof people; score: number; campaignId: string;
};

export const leads: Lead[] = [
  { id: "l1", name: "何志明", company: "順豐達物流有限公司", title: "營運總監", email: "cm.ho@shunfungda.hk", source: "LinkedIn 表格", consent: true, status: "meeting", owner: "kelvin", score: 88, campaignId: "logistics-auto" },
  { id: "l2", name: "Karen Tsang", company: "Pearl Trading Co.", title: "Finance Manager", email: "karen@pearltrading.hk", source: "著陸頁", consent: true, status: "sql", owner: "mandy", score: 76, campaignId: "hk-sme-ai" },
  { id: "l3", name: "梁嘉欣", company: "滿記零售集團", title: "數碼轉型經理", email: "kayan.leung@moonkee.hk", source: "網上研討會", consent: true, status: "mql", owner: "sam", score: 64, campaignId: "summer-webinar" },
  { id: "l4", name: "Derek Lau", company: "Victoria Harbour Consulting", title: "Partner", email: "derek@vhc.com.hk", source: "電子報", consent: false, status: "new", owner: "mandy", score: 41, campaignId: "hk-sme-ai" },
  { id: "l5", name: "鄭子健", company: "葵青貨運", title: "IT 主管", email: "tk.cheng@kwaicargo.hk", source: "LinkedIn 表格", consent: true, status: "opportunity", owner: "kelvin", score: 92, campaignId: "logistics-auto" },
  { id: "l6", name: "Fiona Wong", company: "Lantau Hotels Group", title: "Marketing Director", email: "fiona.w@lantauhotels.com", source: "推薦", consent: true, status: "mql", owner: "sam", score: 58, campaignId: "hk-sme-ai" },
  { id: "l7", name: "吳永康", company: "康健醫療中心", title: "行政總裁", email: "wk.ng@healthplus.hk", source: "著陸頁", consent: true, status: "disqualified", owner: "mandy", score: 22, campaignId: "hk-sme-ai" },
  { id: "l8", name: "Jason Mak", company: "Kowloon Print Works", title: "Owner", email: "jason@klnprint.hk", source: "Facebook 廣告", consent: true, status: "new", owner: "kelvin", score: 47, campaignId: "logistics-auto" },
];

export const funnel = [
  { stage: ["新潛在客戶", "New leads", "新潜在客户"], value: 486 },
  { stage: ["MQL", "MQL", "MQL"], value: 212 },
  { stage: ["SQL", "SQL", "SQL"], value: 94 },
  { stage: ["會議", "Meetings", "会议"], value: 41 },
  { stage: ["商機", "Opportunities", "商机"], value: 17 },
];

export const assets = [
  { id: "asset-car-v4", title: "輪播 — 人手報表隱藏成本", kind: "carousel", status: "in_review", versions: 4, brand: "tonric", hue: 170 },
  { id: "a2", title: "評估倒數快拍", kind: "image", status: "approved", versions: 2, brand: "tonric", hue: 55 },
  { id: "a3", title: "物流案例主視覺", kind: "image", status: "approved", versions: 3, brand: "tonric", hue: 240 },
  { id: "a4", title: "創辦人訪談精華", kind: "video", status: "draft", versions: 1, brand: "tonric", hue: 20 },
  { id: "a5", title: "5 個自動化訊號", kind: "carousel", status: "in_review", versions: 2, brand: "tonric", hue: 150 },
  { id: "a6", title: "Academy 課程海報", kind: "image", status: "rejected", versions: 2, brand: "tonric-academy", hue: 300 },
  { id: "a7", title: "網上研討會封面", kind: "image", status: "approved", versions: 1, brand: "tonric", hue: 200 },
  { id: "a8", title: "ROI 計算機示範", kind: "video", status: "draft", versions: 1, brand: "tonric", hue: 90 },
];

export const videoStages = [
  "brief_draft", "script_draft", "script_locked", "filming", "footage_uploaded",
  "edit_in_progress", "rough_cut_review", "final_cut_review", "handed_off",
] as const;
export const videoStageLabels: Record<string, [string, string, string]> = {
  brief_draft: ["簡報草稿", "Brief draft", "简报草稿"],
  script_draft: ["腳本草稿", "Script draft", "脚本草稿"],
  script_locked: ["腳本已鎖定", "Script locked", "脚本已锁定"],
  filming: ["拍攝中", "Filming", "拍摄中"],
  footage_uploaded: ["已上載片段", "Footage uploaded", "已上传片段"],
  edit_in_progress: ["剪接中", "Editing", "剪辑中"],
  rough_cut_review: ["初剪審閱", "Rough cut review", "初剪审阅"],
  final_cut_review: ["終剪審閱", "Final cut review", "终剪审阅"],
  handed_off: ["已移交", "Handed off", "已移交"],
};

export const videos = [
  { id: "vp-founder", title: "創辦人講 AI 三大誤解", stage: "script_locked", presenter: "林家豪 Eric", brand: "tonric", created: "2026-09-12", platforms: ["LinkedIn 16:9", "Reels 9:16"] },
  { id: "vp-case", title: "葵涌物流客戶見證", stage: "edit_in_progress", presenter: "何志明（客戶）", brand: "tonric", created: "2026-09-05", platforms: ["LinkedIn 1:1", "YouTube 16:9"] },
  { id: "vp-tips", title: "60 秒 Excel 自動化貼士", stage: "script_draft", presenter: "陳美詩 Mandy", brand: "tonric", created: "2026-09-20", platforms: ["Reels 9:16", "Shorts 9:16"] },
  { id: "vp-academy", title: "Academy 導師介紹", stage: "handed_off", presenter: "李詠欣 Ivy", brand: "tonric-academy", created: "2026-08-18", platforms: ["Instagram 4:5"] },
];

export const scriptScenes = [
  { text: "大家好，我係 Tonric 創辦人 Eric。今日想同大家拆解三個關於 AI 嘅常見誤解。", camera: "中景，正面望鏡頭", sec: 8 },
  { text: "第一個誤解：「AI 好貴，只係大公司先用得起。」其實而家好多工具每月幾百蚊已經用得。", camera: "近景，右側字幕", sec: 12 },
  { text: "第二個誤解：「用 AI 要換晒成個系統。」大部分情況，我哋只係喺你現有嘅 Excel 同 ERP 上面加一層自動化。", camera: "中景，插入示範畫面", sec: 14 },
  { text: "第三個誤解：「AI 會取代我嘅員工。」我哋見到嘅係相反——同事終於有時間做真正需要人腦嘅工作。", camera: "近景，慢推", sec: 13 },
  { text: "想知你公司邊啲流程最值得自動化？撳下面連結，免費預約 30 分鐘評估。", camera: "中景，指向下方 CTA", sec: 9 },
];

export const calendarEntries = [
  { day: 2, title: "LinkedIn — AI 誤解系列 1", channel: "linkedin" as Channel, time: "09:30", status: "published" },
  { day: 4, title: "IG 輪播 — 自動化訊號", channel: "instagram" as Channel, time: "12:00", status: "published" },
  { day: 8, title: "電子報 — 九月號", channel: "email" as Channel, time: "18:00", status: "published" },
  { day: 10, title: "FB — 物流案例", channel: "facebook" as Channel, time: "12:00", status: "published" },
  { day: 15, title: "LinkedIn — 案例研究", channel: "linkedin" as Channel, time: "09:30", status: "published" },
  { day: 17, title: "著陸頁更新", channel: "web" as Channel, time: "10:00", status: "published" },
  { day: 21, title: "IG 快拍 — 倒數", channel: "instagram" as Channel, time: "11:15", status: "failed" },
  { day: 23, title: "LinkedIn 帖文 03", channel: "linkedin" as Channel, time: "09:30", status: "published" },
  { day: 23, title: "FB — 4 星期自動化", channel: "facebook" as Channel, time: "12:00", status: "scheduled" },
  { day: 23, title: "電子報 — AI 實戰", channel: "email" as Channel, time: "18:00", status: "scheduled" },
  { day: 24, title: "LinkedIn — ROI 計算機", channel: "linkedin" as Channel, time: "09:30", status: "scheduled" },
  { day: 26, title: "IG Reel — 60 秒貼士", channel: "instagram" as Channel, time: "20:00", status: "scheduled" },
  { day: 29, title: "LinkedIn — 創辦人影片", channel: "linkedin" as Channel, time: "09:30", status: "scheduled" },
  { day: 30, title: "FB — 月結回顧", channel: "facebook" as Channel, time: "12:00", status: "scheduled" },
];

export const notifications = [
  { id: "n1", title: "Ivy 提交咗「Instagram 輪播 — 5 個自動化訊號」等待審批", time: "1 小時前", unread: true, type: "approval_requested" },
  { id: "n2", title: "發佈失敗：Instagram 快拍 — 評估倒數", time: "2 小時前", unread: true, type: "publish_failed" },
  { id: "n3", title: "剪接師已交付「葵涌物流客戶見證」初剪", time: "3 小時前", unread: true, type: "edit_delivered" },
  { id: "n4", title: "LinkedIn 帖文 03 已成功發佈", time: "今日 09:30", unread: false, type: "publish_succeeded" },
  { id: "n5", title: "Kelvin 上載咗 3 段新拍攝片段", time: "昨日", unread: false, type: "video_take_uploaded" },
  { id: "n6", title: "你的審批決定已通知 Mandy", time: "昨日", unread: false, type: "approval_decided" },
];

export const auditLog = [
  { id: "e1042", actor: "陳美詩 Mandy", action: "content.approved", target: "LinkedIn 帖文 03", time: "2026-09-23 18:02", hash: "a91f…3c2e" },
  { id: "e1041", actor: "Copilot（代 林家豪）", action: "content.draft_created", target: "IG 輪播 選項 B", time: "2026-09-23 17:48", hash: "77be…90d1" },
  { id: "e1040", actor: "系統", action: "publish.failed", target: "IG 快拍 — 評估倒數", time: "2026-09-23 11:15", hash: "0c4a…e812" },
  { id: "e1039", actor: "黃俊傑 Kelvin", action: "schedule.confirmed", target: "FB — 4 星期自動化", time: "2026-09-23 10:02", hash: "5d20…aa47" },
  { id: "e1038", actor: "李詠欣 Ivy", action: "approval.requested", target: "IG 輪播 — 5 個訊號", time: "2026-09-23 09:58", hash: "e3f1…1b90" },
  { id: "e1037", actor: "林家豪 Eric", action: "brand.updated", target: "Tonric 通力 · 禁用詞", time: "2026-09-22 16:30", hash: "b612…7f03" },
  { id: "e1036", actor: "張浩然 Sam", action: "asset.version_created", target: "輪播設計 v4", time: "2026-09-22 15:12", hash: "9a0e…c4d5" },
];

export const jobs = [
  { id: "j-8812", queue: "creative.generate", status: "succeeded", duration: "42s", started: "17:48" },
  { id: "j-8811", queue: "publish.dispatch", status: "failed", duration: "3s", started: "11:15", error: "Provider rejected media ratio" },
  { id: "j-8810", queue: "analytics.sync", status: "succeeded", duration: "12s", started: "11:00" },
  { id: "j-8809", queue: "content.checks", status: "running", duration: "—", started: "剛剛" },
  { id: "j-8808", queue: "video.script", status: "succeeded", duration: "28s", started: "09:40" },
  { id: "j-8807", queue: "publish.dispatch", status: "queued", duration: "—", started: "排隊中" },
];

export const aiModels = [
  { profile: "strategy", label: ["策略", "Strategy", "策略"], env: "openai/gpt-6-astra", override: "" },
  { profile: "content", label: ["內容", "Content", "内容"], env: "openai/gpt-6-astra", override: "" },
  { profile: "fast_content", label: ["快速內容", "Fast content", "快速内容"], env: "google/gemini-3.8-flash", override: "" },
  { profile: "image", label: ["圖像", "Image", "图像"], env: "openai/gpt-image-2.5-sunburst", override: "" },
  { profile: "video", label: ["影片", "Video", "视频"], env: "google/gemini-omni-1.1-flash", override: "" },
  { profile: "video_brief", label: ["影片簡報", "Video brief", "视频简报"], env: "openai/gpt-6-astra", override: "" },
  { profile: "video_script", label: ["影片腳本", "Video script", "视频脚本"], env: "openai/gpt-6-astra", override: "custom/zh-hk-script-v2" },
];
