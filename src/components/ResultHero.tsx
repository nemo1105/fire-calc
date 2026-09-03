import { AnimatePresence, motion } from "framer-motion";
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

/* ---------- 账页推导：标签左对齐，数值右对齐成一列 ---------- */

function LedgerRow({
  op,
  label,
  note,
  value,
  tone = "text-cream",
}: {
  op?: string;
  label: string;
  note?: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline gap-2.5 rounded px-1.5 py-[7px] transition-colors duration-150 hover:bg-pine-800/70">
      <span className="w-6 shrink-0 text-center font-mono text-[21px] font-bold leading-none text-mist">
        {op ?? ""}
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] text-mist">
        {label}
        {note && <span className="ml-1.5 font-mono text-[10.5px] text-dim">({note})</span>}
      </span>
      <span className={`shrink-0 font-mono text-sm font-bold tabular-nums ${tone}`}>{value}</span>
    </div>
  );
}

/** 账页进位线：两端略微出血，像手写账本 */
function LedgerRule() {
  return <div className="-mx-4 my-1 border-t border-dashed border-line" />;
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
        {/* 左：账页推导 */}
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

          {/* 账页：C × 实际收益率 → 被动收入 − H ＝ Fn */}
          <div
            className={`mt-6 w-full max-w-[430px] overflow-hidden rounded-lg border border-line-soft border-l-2 bg-pine-900/70 ${
              free ? "border-l-jade" : "border-l-coral/80"
            }`}
          >
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-2">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-dim">
                Derivation · 推演明细
              </span>
              <span className="font-mono text-[10px] text-dim">
                {p.useInflation ? "Fn = C×(Rw−Rf)−H" : "Fn = C×Rw−H"}
              </span>
            </div>
            <div className="px-4 py-2">
              <LedgerRow label="C · 资本总量" value={fmtWan(p.C)} tone="text-gold-soft" />
              <LedgerRow
                op="×"
                label={p.useInflation ? "实际收益率 Rw − Rf" : "名义收益率 Rw"}
                note={p.useInflation ? `${p.Rw}% − ${p.Rf}%` : `Rw ${p.Rw}%`}
                value={`${r.ratePct.toFixed(1)} %`}
              />
              <LedgerRule />
              <LedgerRow
                op="="
                label="年被动收入"
                value={fmtWan(r.passive)}
                tone={passiveCovers ? "text-jade" : "text-coral"}
              />
              <LedgerRow op="−" label="H · 幸福感阈值 · 年开销" value={fmtWan(p.H)} tone="text-coral" />
              <LedgerRule />
              <div className="flex items-center gap-2.5 px-1.5 pb-1.5 pt-2.5">
                <span className="w-6 shrink-0 text-center font-mono text-[21px] font-bold leading-none text-gold">=</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[15px] tracking-wide text-cream">
                    Fn · 财务自由指数
                  </span>
                  <span className={`block text-[10.5px] ${free ? "text-jade" : "text-coral"}`}>
                    {free ? "为正 · 收益已覆盖全年开销" : "为正之前，仍需积累"}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-1.5">
                  <span className={`font-mono text-[26px] font-bold leading-none tabular-nums ${fnColor}`}>
                    {fmtSignedWan(shown)}
                  </span>
                  <span className="font-mono text-[10.5px] text-dim">元/年</span>
                </span>
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
                    : `相当于全年开销的 ${((r.monthsCover! / 12) * 100).toFixed(0)}%`
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
