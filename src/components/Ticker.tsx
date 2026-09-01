const ITEMS = [
  "Fn = C × (Rw − Rf) − H",
  "当 Fn 为正，你已获得财务自由",
  "C · 可产生收益的资本总量",
  "H · 体面生活所需的年开销",
  "Rw · 理财、基金、租金等收益率",
  "Rf · 财富被稀释的速度",
  "低物欲，即刻离自由更近一步",
  "Fuck You 基金：成年人免于恐惧的底气",
  "金钱解决不了的问题，答案在金钱之外",
];

function Coin() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="shrink-0">
      <rect x="1" y="1" width="10" height="10" rx="2" fill="none" stroke="#e8b54a" strokeWidth="1.4" transform="rotate(45 6 6)" />
      <circle cx="6" cy="6" r="1.6" fill="#e8b54a" />
    </svg>
  );
}

export default function Ticker() {
  const row = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-6 pr-6"
      aria-hidden={hidden || undefined}
    >
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center gap-3 whitespace-nowrap">
          <Coin />
          <span className="font-mono text-xs tracking-wide text-mist">{t}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-10 overflow-hidden border-b border-line-soft bg-pine-900/70">
      <div className="ticker-track flex w-max py-2.5">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-pine-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-pine-950 to-transparent" />
    </div>
  );
}
