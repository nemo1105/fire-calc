import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Params, Result } from "../lib/finance";
import { fmtSignedWan, fmtWan } from "../lib/finance";
import { useAnimatedNumber } from "../lib/useAnimatedNumber";

function Corners() {
  const c = "absolute h-3.5 w-3.5 border-gold/70";
  return (
    <>
      <span className={`${c} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${c} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${c} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

const STAMP: Record<
  Result["status"],
  { zh: string; en: string; cls: string; border: string }
> = {
  free: { zh: "已自由", en: "F·I·R·E", cls: "text-jade", border: "border-jade" },
  close: { zh: "临门一脚", en: "ALMOST", cls: "text-gold-soft", border: "border-gold" },
  far: { zh: "道阻且长", en: "ONWARD", cls: "text-coral", border: "border-coral" },
};

/* ---------- 公式单元格（扁平色块，靠排版分层） ---------- */

const KEY_TONES = {
  gold: "border-gold/50 bg-gold/10 text-gold-soft",
  jade: "border-jade/50 bg-jade/10 text-jade",
  coral: "border-coral/50 bg-coral/10 text-coral",
  mist: "border-line bg-pine-900 text-cream",
} as const;

function Key({
  tone,
  label,
  value,
  sub,
}: {
  tone: keyof typeof KEY_TONES;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <span className={`flex shrink-0 flex-col items-center rounded-md border px-3.5 py-2 ${KEY_TONES[tone]}`}>
      <span className="whitespace-nowrap text-[10px] font-semibold tracking-wide opacity-75">{label}</span>
      <span className="whitespace-nowrap font-mono text-[15px] font-bold leading-snug">{value}</span>
      {sub && <span className="whitespace-nowrap font-mono text-[10px] leading-snug opacity-65">{sub}</span>}
    </span>
  );
}

function Op({ children }: { children: ReactNode }) {
  return <span className="shrink-0 font-mono text-lg font-bold text-dim">{children}</span>;
}

/* ---------- 仪表盘 ---------- */

function Gauge({ coverage, free }: { coverage: number; free: boolean }) {
  const anim = useAnimatedNumber(Math.min(coverage, 1) * 100, 700);
  const pct = anim / 100;
  const LEN = Math.PI * 78; // 半圆弧长
  const angle = -180 + pct * 180;
  const nx = 100 + 62 * Math.cos((angle * Math.PI) / 180);
  const ny = 100 + 62 * Math.sin((angle * Math.PI) / 180);
  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="112" viewBox="0 0 200 112">
        <path d="M 22 100 A 78 78 0 0 1 178 100" fill="none" stroke="#1a3d30" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 22 100 A 78 78 0 0 1 178 100"
          fill="none"
          stroke={free ? "#43d98c" : "#e8b54a"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={LEN * (1 - pct)}
          style={{ transition: "stroke 0.4s" }}
        />
        <line x1={100} y1={100} x2={nx} y2={ny} stroke="#f1eada" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="100" r="5" fill="#f1eada" />
      </svg>
      <div className="mt-2.5 text-center">
        <div className="font-mono text-2xl font-bold leading-none text-cream">
          {(coverage * 100).toFixed(0)}
          <span className="text-sm text-mist">%</span>
        </div>
        <div className="mt-1 text-[11px] tracking-wide text-dim">目标资本达成率 C / C*</div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone = "text-cream" }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-md border border-line-soft bg-pine-900/70 px-3.5 py-3 transition-colors duration-200 hover:border-line">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-dim">{label}</div>
      <div className={`mt-1 font-mono text-base font-bold ${tone}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] leading-snug text-mist">{sub}</div>}
    </div>
  );
}

export default function ResultHero({ p, r }: { p: Params; r: Result }) {
  const shown = useAnimatedNumber(r.fn);
  const free = r.status === "free";
  const stamp = STAMP[r.status];
  const passiveCovers = r.passive >= p.H;
  const fnColor = r.fn >= 0 ? "text-jade" : "text-coral";

  return (
    <section className="relative overflow-hidden rounded-lg border border-line bg-pine-850/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <Corners />
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_264px]">
        {/* 左：分层公式 + 结果 */}
        <div className="relative min-w-0 px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                Financial Freedom Index
              </div>
              <h2 className="font-display text-xl tracking-wide text-cream">财务自由指数 Fn</h2>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={r.status}
                initial={{ scale: 1.7, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: -6, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 17 }}
                className={`rounded border-2 px-3 py-1.5 text-center ${stamp.border} ${stamp.cls} bg-pine-950/60`}
              >
                <div className="font-display text-lg leading-none tracking-widest">{stamp.zh}</div>
                <div className="mt-0.5 font-mono text-[9px] tracking-[0.3em]">{stamp.en}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 级联算式：C ×(Rw−Rf) ↓产出 被动收入 − H ＝ Fn
              列2 承载 ×、↓、被动收入（同一中轴）；H 独占列4，左边界必在收益率框右侧 */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="grid grid-cols-[auto_auto_auto_auto] items-center gap-x-2 gap-y-1">
              {/* 上层：C × (Rw−Rf) */}
              <div className="col-start-1 row-start-1">
                <Key tone="gold" label="C·资本总量" value={fmtWan(p.C)} />
              </div>
              <div className="col-start-2 row-start-1 flex justify-center">
                <Op>×</Op>
              </div>
              <div className="col-start-3 row-start-1">
                <Key
                  tone="mist"
                  label={p.useInflation ? "Rw−Rf·实际收益率" : "Rw·名义收益率"}
                  value={`${r.ratePct.toFixed(1)}%`}
                  sub={p.useInflation ? `${p.Rw}% − ${p.Rf}%` : `Rw ${p.Rw}%`}
                />
              </div>

              {/* 产出箭头：位于 × 正下方（列2 中轴） */}
              <div className="col-start-2 row-start-2 flex items-center justify-center gap-1.5 py-0.5">
                <svg width="9" height="12" viewBox="0 0 9 12" aria-hidden className="text-gold-soft">
                  <path
                    d="M4.5 0v8M1.5 5.5 4.5 10l3-4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">产出</span>
              </div>

              {/* 中层：被动收入 − H（被动收入与箭头同轴，整体右移） */}
              <div className="col-start-2 row-start-3 flex justify-center">
                <Key tone={passiveCovers ? "jade" : "coral"} label="年被动收入" value={fmtWan(r.passive)} />
              </div>
              <div className="col-start-3 row-start-3 flex justify-center">
                <Op>−</Op>
              </div>
              <div className="col-start-4 row-start-3">
                <Key tone="coral" label="H·年开销" value={fmtWan(p.H)} />
              </div>
            </div>

            <div className="hidden h-20 w-px shrink-0 bg-gradient-to-b from-transparent via-line to-transparent sm:block" />

            {/* 结果 */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-dim">=</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`whitespace-nowrap font-mono text-[32px] font-bold leading-none tracking-tight ${fnColor}`}>
                    {fmtSignedWan(shown)}
                  </span>
                  <span className="font-mono text-[11px] text-mist">元 / 年</span>
                </div>
                <div className="mt-1.5 text-[10.5px] tracking-wide text-dim">
                  Fn · 自由指数 {free ? "· 为正即已自由" : "· 为正之前，继续积累"}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-mist">
            {free ? (
              <>
                你的资本收益在覆盖全年开销后，每年还富余{" "}
                <b className="text-jade">{fmtWan(r.fn)}</b>——按文章的定义，这一刻你已财务自由。
              </>
            ) : (
              <>
                距离自由每年还差 <b className="text-coral">{fmtWan(Math.abs(r.fn))}</b>，目标资本{" "}
                <b className="text-gold-soft">
                  {Number.isFinite(r.required) ? fmtWan(r.required) : "∞"}
                </b>
                。降低 H、提高 Rw，或继续积累 C，都能加速抵达。
              </>
            )}
          </p>

          {p.useInflation && r.ratePct <= 0 && (
            <p className="mt-3 rounded border border-coral/50 bg-coral/10 px-3 py-2 text-[12px] text-coral">
              ⚠ 收益率跑不赢通胀（Rw ≤ Rf），资本购买力正在缩水——先让收益跑赢印钞机。
            </p>
          )}
        </div>

        {/* 右：仪表盘 + 指标 */}
        <div className="border-t border-dashed border-line-soft bg-pine-900/50 px-5 py-6 lg:border-l lg:border-t-0">
          <Gauge coverage={r.coverage} free={free} />
          <div className="mt-5 space-y-2.5">
            <Stat
              label="所需资本 C* = H/(Rw−Rf)"
              value={Number.isFinite(r.required) ? fmtWan(r.required) : "∞"}
              sub={
                Number.isFinite(r.required) && r.required > p.C
                  ? `还差 ${fmtWan(r.required - p.C)}`
                  : Number.isFinite(r.required)
                    ? "已达标"
                    : "收益 ≤ 通胀，无解"
              }
              tone="text-gold-soft"
            />
            <Stat
              label="被动收入覆盖力"
              value={
                r.monthsCover === null
                  ? "无正收益"
                  : r.monthsCover >= 12
                    ? "≥ 12 个月"
                    : `${r.monthsCover.toFixed(1)} 个月`
              }
              sub={
                r.monthsCover === null
                  ? "先让收益率为正"
                  : r.monthsCover >= 12
                    ? "被动收入已覆盖全年开销"
                    : `相当于全年开销的 ${(r.monthsCover! / 12 * 100).toFixed(0)}%`
              }
              tone={r.monthsCover !== null && r.monthsCover >= 12 ? "text-jade" : "text-cream"}
            />
            <Stat
              label="Fuck You 基金 ≈ 2年开销"
              value={fmtWan(r.fyFund)}
              sub="随时对生活说「不」的底气"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
