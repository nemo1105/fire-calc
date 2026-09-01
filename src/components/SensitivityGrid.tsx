import { SENS_RFS, SENS_RWS, fmtSignedWan, sensitivityFn } from "../lib/finance";

interface Props {
  C: number;
  H: number;
  Rw: number;
  Rf: number;
  onPick: (rw: number, rf: number) => void;
}

export default function SensitivityGrid({ C, H, Rw, Rf, onPick }: Props) {
  const cells = SENS_RFS.flatMap((rf) => SENS_RWS.map((rw) => ({ rw, rf, v: sensitivityFn(C, H, rw, rf) })));
  const maxAbs = Math.max(...cells.map((c) => Math.abs(c.v)), 1);

  const nearest = (arr: number[], v: number) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const curRw = nearest(SENS_RWS, Rw);
  const curRf = nearest(SENS_RFS, Rf);

  return (
    <section className="rounded-lg border border-line bg-pine-850/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg tracking-wide text-cream">Rw × Rf 敏感性沙盘</h3>
          <p className="mt-0.5 text-[11.5px] text-dim">
            按完整公式 Fn = C×(Rw−Rf)−H 推演 · <span className="text-gold-soft">点击任意格子试算</span>
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10.5px] text-mist">
          <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-jade/70" />Fn &gt; 0</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm bg-coral/70" />Fn &lt; 0</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto thin-scroll">
        <div className="grid min-w-[430px] grid-cols-[52px_repeat(5,1fr)] gap-1.5">
          <div />
          {SENS_RWS.map((rw) => (
            <div key={rw} className="pb-1 text-center font-mono text-[11px] font-semibold text-jade">
              Rw {rw}%
            </div>
          ))}
          {SENS_RFS.map((rf) => (
            <RowCells key={rf} rf={rf} C={C} H={H} curRw={curRw} curRf={curRf} maxAbs={maxAbs} onPick={onPick} />
          ))}
        </div>
      </div>
      <p className="mt-3 border-t border-dashed border-line-soft pt-3 text-[11.5px] text-mist">
        通胀每上升 1%，1000 万资本的真实购买力收益就少 10 万/年——Rf 是沉默的财富小偷。
      </p>
    </section>
  );
}

function RowCells({
  rf,
  C,
  H,
  curRw,
  curRf,
  maxAbs,
  onPick,
}: {
  rf: number;
  C: number;
  H: number;
  curRw: number;
  curRf: number;
  maxAbs: number;
  onPick: (rw: number, rf: number) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-end pr-1.5 font-mono text-[11px] font-semibold text-mist">
        Rf {rf}%
      </div>
      {SENS_RWS.map((rw) => {
        const v = sensitivityFn(C, H, rw, rf);
        const a = Math.min(0.16 + (Math.abs(v) / maxAbs) * 0.5, 0.66);
        const isCur = rw === curRw && rf === curRf;
        return (
          <button
            key={rw}
            onClick={() => onPick(rw, rf)}
            title={`Rw ${rw}% · Rf ${rf}% → Fn ${fmtSignedWan(v)}/年`}
            className={`relative rounded px-1 py-2.5 font-mono text-[11px] font-semibold transition-all duration-150 hover:scale-[1.06] hover:shadow-lg ${
              v >= 0 ? "text-jade" : "text-coral"
            } ${isCur ? "ring-2 ring-gold" : ""}`}
            style={{ background: v >= 0 ? `rgba(67,217,140,${a})` : `rgba(242,105,92,${a})` }}
          >
            {fmtSignedWan(v)}
            {isCur && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm bg-gold px-1 font-mono text-[8.5px] font-bold text-pine-950">
                当前
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}
