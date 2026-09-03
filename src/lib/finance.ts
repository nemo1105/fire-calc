/** 公式来自公众号「琳时闲话」《你距离“财务自由”有多远？》
 *  Fn = C × (Rw − Rf) − H
 *  C: 资本总量  H: 幸福感阈值(年开销)  Rw: 投资收益率  Rf: 社会通胀率
 */

export interface Params {
  C: number; // 可投资资本（元）
  H: number; // 年开销（元）
  Rw: number; // 投资收益率 %
  Rf: number; // 通胀率 %
  useInflation: boolean;
  S: number; // 每月新增储蓄（元）
}

export type FreeStatus = "free" | "close" | "far";

export interface SimPoint {
  year: number;
  capital: number;
}

export interface Result {
  rate: number; // 实际收益率（小数）
  ratePct: number; // 实际收益率 %
  passive: number; // 年被动收入
  fn: number; // 财务自由指数
  required: number; // 所需资本 C* = H / rate
  coverage: number; // C / C*
  monthsCover: number | null; // 被动收入可覆盖多少个月开销
  fyFund: number; // Fuck You 基金 ≈ 2 年开销
  status: FreeStatus;
  crossYear: number | null;
  points: SimPoint[];
}

const HORIZON = 60;

export function computeResults(p: Params): Result {
  const rate = (p.useInflation ? p.Rw - p.Rf : p.Rw) / 100;
  const passive = p.C * rate;
  const fn = passive - p.H;
  const required = rate > 0 ? p.H / rate : Infinity;
  const coverage = Number.isFinite(required) && required > 0 ? p.C / required : fn >= 0 ? 1 : 0;
  const monthsCover = passive > 0 && p.H > 0 ? (passive * 12) / p.H : null;
  const fyFund = p.H * 2;

  let status: FreeStatus = "far";
  if (fn >= 0) status = "free";
  else if (coverage >= 0.66) status = "close";

  // 以“实际收益率”推演资产（开销按今日购买力计）
  const points: SimPoint[] = [{ year: 0, capital: p.C }];
  let cap = p.C;
  let crossYear: number | null = null;
  for (let t = 1; t <= HORIZON; t++) {
    cap = cap * (1 + rate) + p.S * 12;
    points.push({ year: t, capital: cap });
    if (crossYear === null && Number.isFinite(required) && cap >= required) {
      crossYear = t;
    }
  }
  const end = crossYear !== null ? Math.min(crossYear + 6, HORIZON) : 40;
  return {
    rate,
    ratePct: rate * 100,
    passive,
    fn,
    required,
    coverage,
    monthsCover,
    fyFund,
    status,
    crossYear,
    points: points.slice(0, end + 1),
  };
}

export function sensitivityFn(C: number, H: number, rw: number, rf: number): number {
  return (C * (rw - rf)) / 100 - H;
}

/* ---------------- 格式化 ---------------- */

export function trimNum(n: number, d: number): string {
  return parseFloat(n.toFixed(d)).toLocaleString("en-US", {
    maximumFractionDigits: d,
  });
}

/** 以 万/亿/万亿 为单位格式化金额（不带符号） */
export function fmtWan(y: number): string {
  const abs = Math.abs(y);
  if (abs >= 1e12) return `${trimNum(y / 1e12, 2)} 万亿`;
  if (abs >= 1e8) return `${trimNum(y / 1e8, 2)} 亿`;
  if (abs >= 1e4) return `${trimNum(y / 1e4, 1)} 万`;
  return `${Math.round(y).toLocaleString("en-US")} 元`;
}

/** 带正负号的 万/亿 */
export function fmtSignedWan(y: number): string {
  const s = y > 0 ? "+" : y < 0 ? "−" : "±";
  return `${s}${fmtWan(Math.abs(y))}`;
}

export function fmtMoney(y: number): string {
  return `¥${Math.round(y).toLocaleString("en-US")}`;
}

/* ---------------- 预设场景 ---------------- */

export interface Preset {
  id: string;
  name: string;
  desc: string;
  values: Params;
}

export const PRESETS: Preset[] = [
  {
    id: "classic",
    name: "经典案例",
    desc: "1000万资本 · 年开销30万 · 收益9% · 通胀3%",
    values: { C: 10_000_000, H: 300_000, Rw: 9, Rf: 3, useInflation: true, S: 10_000 },
  },
  {
    id: "lean",
    name: "低物欲生活",
    desc: "控制物欲，离自由更近一步",
    values: { C: 3_000_000, H: 120_000, Rw: 7.5, Rf: 3, useInflation: true, S: 8_000 },
  },
  {
    id: "decent",
    name: "体面中产",
    desc: "维持良好生活质量的年开销",
    values: { C: 6_000_000, H: 300_000, Rw: 8, Rf: 3, useInflation: true, S: 15_000 },
  },
  {
    id: "rich",
    name: "高配人生",
    desc: "更高的幸福阈值，更大的资本盘",
    values: { C: 20_000_000, H: 600_000, Rw: 8.5, Rf: 3, useInflation: true, S: 30_000 },
  },
];

/* ---------------- 自由段位阶梯 ---------------- */

export interface Tier {
  key: string;
  name: string;
  en: string;
  threshold: number; // 解锁所需资本（元）
  blurb: string;
}

export const TIERS: Tier[] = [
  { key: "market", name: "菜场自由", en: "GROCERY", threshold: 100_000, blurb: "买菜不看价，车厘子随便拿" },
  { key: "dining", name: "饭店自由", en: "DINING", threshold: 300_000, blurb: "下馆子不翻折扣页" },
  { key: "wardrobe", name: "穿衣自由", en: "WARDROBE", threshold: 800_000, blurb: "喜欢的衣服直接拿下" },
  { key: "travel", name: "旅行自由", en: "TRAVEL", threshold: 2_000_000, blurb: "说走就走，舱位随心" },
  { key: "car", name: "座驾自由", en: "MOTOR", threshold: 5_000_000, blurb: "爱车清单逐一兑现" },
  { key: "home", name: "安居自由", en: "ESTATE", threshold: 10_000_000, blurb: "住哪里，自己说了算" },
  { key: "edu", name: "教育自由", en: "EDUCATION", threshold: 20_000_000, blurb: "下一代的学费不焦虑" },
  { key: "health", name: "医疗自由", en: "HEALTHCARE", threshold: 35_000_000, blurb: "最好的医疗兜底" },
  { key: "true", name: "终极自由", en: "TRUE FIRE", threshold: 50_000_000, blurb: "时间完全属于自己" },
];

export const SENS_RWS = [4, 6, 8, 10, 12];
export const SENS_RFS = [2, 3, 4, 5, 6];
