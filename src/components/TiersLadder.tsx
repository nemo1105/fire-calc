import type { ReactNode } from "react";
import { TIERS, fmtWan } from "../lib/finance";

const ICONS: Record<string, ReactNode> = {
  market: (
    <path d="M12 3c-4 3.5-7 6.6-7 10a7 7 0 0 0 14 0c0-3.4-3-6.5-7-10Zm0 5v9M9 13l3 2 3-2" />
  ),
  dining: <path d="M4 12h16a8 8 0 0 1-16 0Zm4-4c0-1.5 1-1.5 1-3m4 3c0-1.5 1-1.5 1-3M3 20h18" />,
  wardrobe: <path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3a4 4 0 0 1-8 0Z" />,
  travel: <path d="M2.5 13.5 21 6l-7.5 15-2.6-6.4-8.4-1.1Zm8.4 1.1L21 6" />,
  car: <path d="M4 16v-3l1.6-4.2A2 2 0 0 1 7.5 7h9a2 2 0 0 1 1.9 1.8L20 13v3m-16 0h16M4 16v2m16-2v2M6.5 13h.01M17.5 13h.01" />,
  home: <path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />,
  edu: <path d="M12 4 2 8.5l10 4.5 10-4.5L12 4Zm-6 6.8V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.2M22 8.5V14" />,
  health: <path d="M12 3a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7Zm0 4v6m-3-3h6" />,
  true: <path d="M3 18h18M5 18 3.5 7l5 3L12 4l3.5 6 5-3L19 18M9.5 14.5 12 10l2.5 4.5" />,
};

export default function TiersLadder({ C }: { C: number }) {
  const unlocked = TIERS.filter((t) => C >= t.threshold).length;
  const next = TIERS.find((t) => C < t.threshold);

  return (
    <section className="rounded-lg border border-line bg-pine-850/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-lg tracking-wide text-cream">自由段位阶梯</h3>
          <p className="mt-0.5 text-[11.5px] text-dim">
            网传“九段自由”· 以你的资本总量 C 判定 · 已点亮{" "}
            <b className="font-mono text-gold-soft">
              {unlocked}/{TIERS.length}
            </b>{" "}
            段
          </p>
        </div>
        {next && (
          <p className="font-mono text-[11px] text-mist">
            下一段 <b className="text-gold-soft">{next.name}</b> 还差{" "}
            <b className="text-gold-soft">{fmtWan(next.threshold - C)}</b>
          </p>
        )}
      </div>

      <div className="mt-6 overflow-x-auto pb-2 thin-scroll">
        <ol className="relative flex min-w-[980px] items-end">
          {/* 阶梯连线 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-line" />
          {TIERS.map((t, i) => {
            const done = C >= t.threshold;
            const isNext = !done && (i === 0 || C >= TIERS[i - 1].threshold);
            const prog = Math.min(C / t.threshold, 1);
            return (
              <li
                key={t.key}
                className="group relative flex-1 px-1.5"
                style={{ paddingBottom: `${14 + i * 13}px` }}
              >
                {/* 节点 */}
                <span
                  className={`absolute bottom-[-5px] left-1/2 z-10 h-[11px] w-[11px] -translate-x-1/2 rotate-45 border-2 transition-colors duration-300 ${
                    done ? "border-gold bg-gold shadow-[0_0_12px_rgba(232,181,74,0.8)]" : "border-line bg-pine-950"
                  }`}
                />
                <div
                  className={`relative rounded-md border px-3 py-3 text-center transition-all duration-200 group-hover:-translate-y-1 ${
                    done
                      ? "border-gold/60 bg-gold/10 shadow-[0_8px_24px_rgba(232,181,74,0.12)]"
                      : isNext
                        ? "border-line bg-pine-800"
                        : "border-line-soft bg-pine-900/60 opacity-70"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`mx-auto h-7 w-7 ${done ? "text-gold" : "text-dim"} transition-colors`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[t.key]}
                  </svg>
                  <div className={`mt-1.5 text-[13px] font-bold ${done ? "text-gold-soft" : "text-cream"}`}>
                    {t.name}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.18em] text-dim">{t.en}</div>
                  <div className={`mt-1 font-mono text-[11px] font-semibold ${done ? "text-gold" : "text-mist"}`}>
                    {done ? "已解锁 ✓" : fmtWan(t.threshold)}
                  </div>
                  <p className="mt-1 hidden text-[10px] leading-snug text-dim lg:block">{t.blurb}</p>
                  {isNext && (
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-pine-950">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-jade-deep to-jade transition-all duration-500"
                        style={{ width: `${prog * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-2 text-[10.5px] text-dim">* 段位门槛为网络流传说法的整理，仅供参照娱乐；真正的标准，由你的 H 说了算。</p>
    </section>
  );
}
