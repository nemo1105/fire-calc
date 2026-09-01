import { fmtSignedWan } from "../lib/finance";
import { useAnimatedNumber } from "../lib/useAnimatedNumber";

function Seal() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
      <rect x="2" y="2" width="48" height="48" rx="6" fill="#e8b54a" />
      <rect x="6" y="6" width="40" height="40" rx="3" fill="none" stroke="#0b2019" strokeWidth="2" />
      <text
        x="26"
        y="33"
        textAnchor="middle"
        fontFamily="'ZCOOL QingKe HuangYou','Noto Sans SC',sans-serif"
        fontSize="24"
        fill="#0b2019"
      >
        自由
      </text>
    </svg>
  );
}

const VARS: { k: string; label: string; cls: string }[] = [
  { k: "C", label: "资本总量", cls: "text-gold-soft" },
  { k: "H", label: "幸福感阈值 · 年开销", cls: "text-coral" },
  { k: "Rw", label: "投资收益率", cls: "text-jade" },
  { k: "Rf", label: "社会通胀率", cls: "text-mist" },
];

export default function Header({ fn }: { fn: number }) {
  const shown = useAnimatedNumber(fn);
  const positive = fn >= 0;
  return (
    <header className="relative z-10 border-b border-line-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-4 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="transition-transform duration-300 hover:-rotate-6">
            <Seal />
          </div>
          <div>
            <h1 className="font-display text-[26px] leading-none tracking-wide text-cream sm:text-[32px]">
              财务自由计算器
            </h1>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
              F · I · R · E&nbsp;&nbsp;Freedom Index Calculator
            </p>
          </div>
        </div>

        {/* 公式 */}
        <div className="hidden items-center gap-2 font-mono text-sm lg:flex">
          <span className="rounded border border-line bg-pine-900/80 px-2.5 py-1 text-cream">
            Fn&nbsp;=
          </span>
          <span className="rounded border border-gold/40 bg-gold/10 px-2.5 py-1 font-semibold text-gold-soft">
            C
          </span>
          <span className="text-dim">×</span>
          <span className="rounded border border-line bg-pine-900/80 px-2.5 py-1 text-cream">
            (<span className="font-semibold text-jade">Rw</span>
            <span className="text-dim"> − </span>
            <span className="font-semibold text-mist">Rf</span>)
          </span>
          <span className="text-dim">−</span>
          <span className="rounded border border-coral/40 bg-coral/10 px-2.5 py-1 font-semibold text-coral">
            H
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div
            className={`rounded-md border px-4 py-2 text-right transition-colors duration-500 ${
              positive ? "border-jade/50 bg-jade/10" : "border-coral/50 bg-coral/10"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              自由指数 · 实时
            </div>
            <div
              className={`font-mono text-lg font-bold leading-tight ${
                positive ? "text-jade" : "text-coral"
              }`}
            >
              {fmtSignedWan(shown)}
              <span className="ml-1 text-[11px] font-medium text-mist">/年</span>
            </div>
          </div>
        </div>
      </div>

      {/* 变量图例 */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1.5 px-5 pb-4 sm:px-8 lg:hidden">
        {VARS.map((v) => (
          <span key={v.k} className="flex items-center gap-1.5 text-xs text-mist">
            <b className={`font-mono ${v.cls}`}>{v.k}</b> {v.label}
          </span>
        ))}
      </div>
    </header>
  );
}
