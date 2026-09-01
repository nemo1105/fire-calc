import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { Result } from "../lib/finance";
import { fmtWan } from "../lib/finance";

const W = 620;
const H = 260;
const PAD = { l: 62, r: 18, t: 18, b: 30 };

export default function ProjectionChart({ r, S }: { r: Result; S: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const pts = r.points;
  const finiteReq = Number.isFinite(r.required);
  const maxCap = Math.max(...pts.map((d) => d.capital), 0);
  const maxY = Math.max(maxCap, finiteReq ? r.required : 0) * 1.12 || 1;

  const x = (year: number) => PAD.l + (year / Math.max(pts.length - 1, 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (Math.max(v, 0) / maxY) * (H - PAD.t - PAD.b);

  const line = pts.map((d, i) => `${i === 0 ? "M" : "L"}${x(d.year).toFixed(1)},${y(d.capital).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts[pts.length - 1].year).toFixed(1)},${H - PAD.b} L${x(0)},${PAD.l ? H - PAD.b : H - PAD.b} L${x(0)},${y(pts[0].capital).toFixed(1)} Z`;

  const yTicks = [0.25, 0.5, 0.75, 1].map((t) => maxY * t);
  const xStep = pts.length > 30 ? 8 : 5;

  const onMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (mx - PAD.l) / (W - PAD.l - PAD.r);
    const idx = Math.round(ratio * (pts.length - 1));
    setHover(Math.max(0, Math.min(pts.length - 1, idx)));
  };

  const hv = hover !== null ? pts[hover] : null;
  const crossPt = r.crossYear !== null ? pts.find((d) => d.year === r.crossYear) ?? null : null;

  return (
    <section className="rounded-lg border border-line bg-pine-850/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg tracking-wide text-cream">资产推演 · 通往自由之路</h3>
          <p className="mt-0.5 text-[11.5px] text-dim">
            实际收益率 {r.ratePct.toFixed(1)}%/年 · 每年追加储蓄 {fmtWan(S * 12)} · 按今日购买力计
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-mist">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[3px] w-5 rounded bg-jade" /> 资产曲线
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 border-t-2 border-dashed border-gold" /> 自由线 C*
          </span>
        </div>
      </div>

      <div className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#43d98c" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#43d98c" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* 网格与刻度 */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#1a3d30" strokeWidth="1" />
              <text x={PAD.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#64826f" fontFamily="IBM Plex Mono, monospace">
                {fmtWan(t)}
              </text>
            </g>
          ))}
          <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#265743" strokeWidth="1.5" />
          {pts.filter((d) => d.year % xStep === 0).map((d) => (
            <text key={d.year} x={x(d.year)} y={H - 10} textAnchor="middle" fontSize="10" fill="#64826f" fontFamily="IBM Plex Mono, monospace">
              {d.year}年
            </text>
          ))}

          {/* 自由线 */}
          {finiteReq && (
            <g>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(r.required)} y2={y(r.required)} stroke="#e8b54a" strokeWidth="1.6" strokeDasharray="7 5" opacity="0.9" />
              <text x={W - PAD.r} y={y(r.required) - 6} textAnchor="end" fontSize="10" fill="#e8b54a" fontFamily="IBM Plex Mono, monospace">
                自由线 {fmtWan(r.required)}
              </text>
            </g>
          )}

          {/* 资产曲线 */}
          <path d={area} fill="url(#areaFill)" />
          <path d={line} fill="none" stroke="#43d98c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* 自由临界点 */}
          {crossPt && (
            <g>
              <circle className="pulse-ring" cx={x(crossPt.year)} cy={y(crossPt.capital)} r="9" fill="none" stroke="#e8b54a" strokeWidth="2" />
              <circle cx={x(crossPt.year)} cy={y(crossPt.capital)} r="5" fill="#e8b54a" stroke="#0b2019" strokeWidth="2" />
              <text
                x={Math.min(x(crossPt.year) + 12, W - 120)}
                y={y(crossPt.capital) - 12}
                fontSize="11"
                fontWeight="700"
                fill="#f3d488"
                fontFamily="IBM Plex Mono, monospace"
              >
                第 {crossPt.year} 年 · 自由
              </text>
            </g>
          )}

          {/* 悬停 */}
          {hv && (
            <g>
              <line x1={x(hv.year)} x2={x(hv.year)} y1={PAD.t} y2={H - PAD.b} stroke="#f1eada" strokeWidth="1" opacity="0.35" />
              <circle cx={x(hv.year)} cy={y(hv.capital)} r="4.5" fill="#f1eada" stroke="#0b2019" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hv && (
          <div
            className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded border border-line bg-pine-950/95 px-3 py-1.5 text-center shadow-lg"
            style={{ left: `${(x(hv.year) / W) * 100}%` }}
          >
            <div className="font-mono text-[10px] text-dim">第 {hv.year} 年</div>
            <div className="font-mono text-[13px] font-bold text-jade">{fmtWan(hv.capital)}</div>
          </div>
        )}
      </div>

      <p className="mt-3 border-t border-dashed border-line-soft pt-3 text-[12px] leading-relaxed text-mist">
        {r.crossYear !== null ? (
          <>
            保持现状：约 <b className="font-mono text-gold-soft">{r.crossYear} 年</b>后资产站上自由线
            {fmtWan(r.required)}，届时 Fn ≥ 0。
          </>
        ) : finiteReq ? (
          <>
            以当前节奏，<b className="font-mono text-coral">40 年内</b>无法触及自由线——试试调高储蓄或收益率。
          </>
        ) : (
          <span className="text-coral">收益未能跑赢通胀，自由线在无穷远处；先解决“跑赢印钞机”的问题。</span>
        )}
      </p>
    </section>
  );
}
