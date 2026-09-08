import { fmtSignedWan } from "../lib/finance";
import { useAnimatedNumber } from "../lib/useAnimatedNumber";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../lib/i18n";

function Seal() {
  const { lang } = useLanguage();
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
        {lang === "zh" ? "自由" : "FREE"}
      </text>
    </svg>
  );
}

const VARS_ZH: { k: string; label: string; cls: string }[] = [
  { k: "C", label: "资本总量", cls: "text-gold-soft" },
  { k: "H", label: "幸福感阈值 · 年开销", cls: "text-coral" },
  { k: "Rw", label: "投资收益率", cls: "text-jade" },
  { k: "Rf", label: "社会通胀率", cls: "text-mist" },
];

const VARS_EN: { k: string; label: string; cls: string }[] = [
  { k: "C", label: "Total Capital", cls: "text-gold-soft" },
  { k: "H", label: "Happiness Threshold", cls: "text-coral" },
  { k: "Rw", label: "Investment Return", cls: "text-jade" },
  { k: "Rf", label: "Social Inflation", cls: "text-mist" },
];

export default function Header({ fn }: { fn: number }) {
  const { lang, toggleLang } = useLanguage();
  const shown = useAnimatedNumber(fn);
  const positive = fn >= 0;
  const VARS = lang === "zh" ? VARS_ZH : VARS_EN;
  
  return (
    <header className="relative z-10 border-b border-line-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-4 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="transition-transform duration-300 hover:-rotate-6">
            <Seal />
          </div>
          <div>
            <h1 className="font-display text-[26px] leading-none tracking-wide text-cream sm:text-[32px]">
              {lang === "zh" ? "财务自由计算器" : "Financial Freedom Calculator"}
            </h1>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-dim">
              F · I · R · E&nbsp;&nbsp;{lang === "zh" ? "Freedom Index Calculator" : "Freedom Index Calculator"}
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
          {/* 语言切换按钮 */}
          <button
            onClick={toggleLang}
            className="rounded-md border border-line bg-pine-900/80 px-3 py-2 font-mono text-xs font-semibold text-cream transition-colors hover:border-gold/60 hover:bg-pine-800"
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
          >
            {lang === "zh" ? "EN" : "中文"}
          </button>
          
          <div
            className={`rounded-md border px-4 py-2 text-right transition-colors duration-500 ${
              positive ? "border-jade/50 bg-jade/10" : "border-coral/50 bg-coral/10"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              {lang === "zh" ? "自由指数 · 实时" : "Freedom Index · Live"}
            </div>
            <div
              className={`font-mono text-lg font-bold leading-tight ${
                positive ? "text-jade" : "text-coral"
              }`}
            >
              {fmtSignedWan(shown)}
              <span className="ml-1 text-[11px] font-medium text-mist">{lang === "zh" ? "/年" : "/yr"}</span>
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
