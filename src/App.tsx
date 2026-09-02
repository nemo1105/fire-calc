import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Ticker from "./components/Ticker";
import InputsPanel from "./components/InputsPanel";
import ResultHero from "./components/ResultHero";
import ProjectionChart from "./components/ProjectionChart";
import SensitivityGrid from "./components/SensitivityGrid";
import TiersLadder from "./components/TiersLadder";
import Footer from "./components/Footer";
import { PRESETS, computeResults, type Params } from "./lib/finance";

const DEFAULTS: Params = PRESETS[0].values;

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** 环境背景：账本网格 + 双侧光晕 + 竖排水印 + 漂浮符号 */
function Ambient() {
  const floats = [
    { ch: "¥", cls: "left-[6%] top-[18%] text-gold/20 text-5xl", d: "0s" },
    { ch: "¥", cls: "left-[12%] bottom-[16%] text-jade/15 text-3xl", d: "-4s" },
    { ch: "%", cls: "right-[16%] top-[30%] text-mist/15 text-4xl", d: "-7s" },
    { ch: "¥", cls: "left-[46%] top-[64%] text-gold/10 text-6xl", d: "-2.5s" },
    { ch: "+", cls: "right-[38%] bottom-[10%] text-jade/15 text-4xl", d: "-9s" },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="ledger-grid absolute inset-0" />
      <div
        className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,181,74,0.09) 0%, transparent 62%)" }}
      />
      <div
        className="absolute -bottom-48 -left-40 h-[620px] w-[620px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(67,217,140,0.08) 0%, transparent 62%)" }}
      />
      <div className="wm-vertical absolute right-2 top-1/2 -translate-y-1/2 select-none font-display text-[150px] leading-none tracking-[0.2em] text-cream/[0.035] sm:text-[190px]">
        财务自由
      </div>
      {floats.map((f, i) => (
        <span
          key={i}
          className={`floaty absolute select-none font-mono font-bold ${f.cls}`}
          style={{ animationDelay: f.d }}
        >
          {f.ch}
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [p, setP] = useState<Params>(DEFAULTS);
  const [activePreset, setActivePreset] = useState<string | null>(PRESETS[0].id);

  const result = useMemo(() => computeResults(p), [p]);

  const patch = (u: Partial<Params>) => {
    setP((prev) => ({ ...prev, ...u }));
    setActivePreset(null);
  };

  const onPreset = (id: string) => {
    const pre = PRESETS.find((x) => x.id === id);
    if (!pre) return;
    setP(pre.values);
    setActivePreset(id);
  };

  const onSensPick = (rw: number, rf: number) => patch({ Rw: rw, Rf: rf, useInflation: true });

  return (
    <div className="min-h-screen bg-pine-950 font-body text-cream antialiased">
      <Ambient />

      <Header fn={result.fn} />
      <Ticker />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-4 pt-8 sm:px-8">
        {/* 引言条 */}
        <Reveal>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl">
              <h2 className="font-display text-[26px] leading-snug tracking-wide text-cream sm:text-[30px]">
                你距离<span className="text-gold-soft">“财务自由”</span>有多远？
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-mist">
                调一调四个变量：当 <b className="font-mono text-cream">Fn</b> 为正，资本收益已能覆盖体面生活的开销——
                那一刻，你便获得了文章所说的财务自由。
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">
              <span className="blink-soft inline-block h-2 w-2 rounded-full bg-jade" />
              实时演算中
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[368px_minmax(0,1fr)]">
          {/* 左：参数面板 */}
          <Reveal className="lg:sticky lg:top-6 lg:self-start">
            <InputsPanel p={p} patch={patch} activePreset={activePreset} onPreset={onPreset} />
          </Reveal>

          {/* 右：结果仪表盘 */}
          <div className="min-w-0 space-y-6">
            <Reveal delay={0.08}>
              <ResultHero p={p} r={result} />
            </Reveal>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
              <Reveal delay={0.05}>
                <ProjectionChart r={result} S={p.S} />
              </Reveal>
              <Reveal delay={0.12}>
                <SensitivityGrid C={p.C} H={p.H} Rw={p.Rw} Rf={p.Rf} onPick={onSensPick} />
              </Reveal>
            </div>

            <Reveal delay={0.05}>
              <TiersLadder C={p.C} />
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
