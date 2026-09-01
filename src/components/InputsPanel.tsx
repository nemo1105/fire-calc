import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRESETS, fmtMoney, trimNum, type Params } from "../lib/finance";

interface Props {
  p: Params;
  patch: (u: Partial<Params>) => void;
  activePreset: string | null;
  onPreset: (id: string) => void;
}

function VarBadge({ k, cls }: { k: string; cls: string }) {
  return (
    <span
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded border px-1.5 font-mono text-sm font-bold ${cls}`}
    >
      {k}
    </span>
  );
}

/** 自由数字输入：聚焦后可编辑（可清空、可输任意值含负数）；
 *  输入后 200ms 防抖自动提交并触发计算，失焦/回车立即提交，Esc 还原 */
function NumInput({
  value,
  decimals,
  disabled,
  onCommit,
}: {
  value: number;
  decimals: number;
  disabled?: boolean;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const formatted = trimNum(value, decimals);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  /** 防抖提交：停止输入 200ms 后，合法数值自动生效并参与计算 */
  const scheduleCommit = (text: string) => {
    clearTimer();
    const raw = text.replace(/,/g, "").trim();
    const v = Number(raw);
    if (raw === "" || !Number.isFinite(v)) return; // 空 / 输入中途（如 "-" "3."）不提交
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (v !== value) onCommit(v);
    }, 200);
  };

  /** 失焦 / 回车：立即提交 */
  const commitNow = () => {
    clearTimer();
    if (draft === null) return;
    const raw = draft.replace(/,/g, "").trim();
    const v = Number(raw);
    setDraft(null);
    if (raw !== "" && Number.isFinite(v) && v !== value) onCommit(v);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      placeholder="—"
      className="w-24 rounded border border-line bg-pine-950/70 px-2 py-1 text-right font-mono text-sm font-semibold text-gold-soft caret-gold outline-none transition-all duration-150 hover:border-gold/40 focus:border-gold focus:bg-pine-950 focus:shadow-[0_0_0_3px_rgba(232,181,74,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
      value={draft ?? formatted}
      disabled={disabled}
      aria-invalid={draft !== null && draft.trim() !== "" && !Number.isFinite(Number(draft.replace(/,/g, "")))}
      onFocus={(e) => {
        clearTimer();
        setDraft(formatted);
        requestAnimationFrame(() => e.target.select());
      }}
      onChange={(e) => {
        setDraft(e.target.value);
        scheduleCommit(e.target.value);
      }}
      onBlur={commitNow}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          clearTimer();
          setDraft(null);
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function Row({
  badge,
  badgeCls,
  title,
  hint,
  unit,
  value,
  min,
  max,
  step,
  decimals = 0,
  onChange,
  disabled = false,
  trackColor = "#e8b54a",
}: {
  badge: string;
  badgeCls: string;
  title: string;
  hint: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  trackColor?: string;
}) {
  const clamped = Math.min(max, Math.max(min, value));
  const pct = Math.min(100, Math.max(0, ((clamped - min) / (max - min)) * 100));
  const outOfSlider = value < min || value > max;
  const style = { "--p": `${pct}%`, "--track-on": trackColor } as CSSProperties;
  return (
    <div className={`group ${disabled ? "opacity-45" : ""} transition-opacity duration-300`}>
      <div className="mb-1 flex items-center gap-2.5">
        <VarBadge k={badge} cls={badgeCls} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-bold text-cream">{title}</span>
            <span className="flex items-baseline gap-1">
              <NumInput value={value} decimals={decimals} disabled={disabled} onCommit={onChange} />
              <span className="text-[11px] text-mist">{unit}</span>
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-dim">
            {hint}
            {outOfSlider && !disabled && (
              <span className="ml-1 font-mono text-[10px] text-gold-soft">· 已超出滑杆范围，数值仍可生效</span>
            )}
          </p>
        </div>
      </div>
      <input
        type="range"
        className="fin-range"
        style={style}
        min={min}
        max={max}
        step={step}
        value={clamped}
        disabled={disabled}
        aria-label={title}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function InputsPanel({ p, patch, activePreset, onPreset }: Props) {
  return (
    <aside className="rounded-lg border border-line bg-pine-850/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
        <h2 className="font-display text-lg tracking-wide text-cream">参数 · 四个变量</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">Inputs</span>
      </div>
      <p className="border-b border-dashed border-line-soft bg-pine-900/40 px-5 py-2 text-[10.5px] leading-snug text-dim">
        拖动滑杆快捷调节 · 点击数字可自由编辑——支持清空重输与负数，回车确认 / Esc 取消
      </p>

      {/* 预设场景 */}
      <div className="px-5 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-dim">
          预设场景 · Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((pre) => {
            const active = activePreset === pre.id;
            return (
              <button
                key={pre.id}
                onClick={() => onPreset(pre.id)}
                className={`group/p rounded-md border px-3 py-2 text-left transition-all duration-200 ${
                  active
                    ? "border-gold bg-gold/15 shadow-[0_0_18px_rgba(232,181,74,0.18)]"
                    : "border-line-soft bg-pine-900/60 hover:-translate-y-0.5 hover:border-gold/60"
                }`}
              >
                <span
                  className={`block text-[13px] font-bold ${active ? "text-gold-soft" : "text-cream"}`}
                >
                  {pre.name}
                  {active && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold blink-soft" />}
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-snug text-dim transition-colors group-hover/p:text-mist">
                  {pre.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <Row
          badge="C"
          badgeCls="border-gold/50 bg-gold/10 text-gold-soft"
          title="资本总量"
          hint="可用于投资产生收益的财富（现金、基金、收租资产等）"
          unit="万元"
          value={p.C / 1e4}
          min={0}
          max={5000}
          step={10}
          onChange={(v) => patch({ C: v * 1e4 })}
          trackColor="#e8b54a"
        />
        <Row
          badge="H"
          badgeCls="border-coral/50 bg-coral/10 text-coral"
          title="幸福感阈值 · 年开销"
          hint="维持你体面生活所必须的年净开销"
          unit="万元/年"
          value={p.H / 1e4}
          min={1}
          max={200}
          step={1}
          onChange={(v) => patch({ H: v * 1e4 })}
          trackColor="#f2695c"
        />
        <Row
          badge="Rw"
          badgeCls="border-jade/50 bg-jade/10 text-jade"
          title="投资收益率"
          hint="银行理财、股票基金、房屋租金等综合年化收益"
          unit="%"
          value={p.Rw}
          min={0}
          max={15}
          step={0.1}
          decimals={1}
          onChange={(v) => patch({ Rw: v })}
          trackColor="#43d98c"
        />

        {/* 通胀开关 */}
        <div className="flex items-center justify-between rounded-md border border-line-soft bg-pine-900/60 px-3 py-2.5">
          <div>
            <p className="text-[13px] font-bold text-cream">考虑通胀稀释</p>
            <p className="text-[11px] text-dim">关闭后公式简化为 Fn = C×Rw − H</p>
          </div>
          <button
            role="switch"
            aria-checked={p.useInflation}
            onClick={() => patch({ useInflation: !p.useInflation })}
            className={`relative h-7 w-[52px] shrink-0 rounded-full border transition-colors duration-300 ${
              p.useInflation ? "border-gold bg-gold/30" : "border-line bg-pine-950"
            }`}
          >
            <span
              className={`absolute top-[3px] h-5 w-5 rounded-full transition-all duration-300 ${
                p.useInflation ? "left-[26px] bg-gold shadow-[0_0_10px_rgba(232,181,74,0.7)]" : "left-[3px] bg-dim"
              }`}
            />
          </button>
        </div>

        <Row
          badge="Rf"
          badgeCls="border-line bg-pine-900 text-mist"
          title="社会通胀率"
          hint="你的财富总量被稀释的速度"
          unit="%"
          value={p.Rf}
          min={0}
          max={10}
          step={0.1}
          decimals={1}
          disabled={!p.useInflation}
          onChange={(v) => patch({ Rf: v })}
          trackColor="#9ab5a8"
        />

        <div className="rounded-md border border-dashed border-line bg-pine-900/50 px-3.5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-dim">
            推演辅助 · 每月储蓄
          </p>
          <div className="mt-2">
            <Row
              badge="S"
              badgeCls="border-line bg-pine-800 text-cream"
              title="每月新增储蓄"
              hint="仅用于下方资产推演图，不计入 Fn 公式"
              unit="元/月"
              value={p.S}
              min={0}
              max={50000}
              step={500}
              onChange={(v) => patch({ S: v })}
              trackColor="#9ab5a8"
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-mist">
            当前年储蓄 ≈ <b className="text-gold-soft">{fmtMoney(p.S * 12)}</b>
          </p>
        </div>
      </div>

      <div className="border-t border-line-soft px-5 py-3">
        <p className="text-[10.5px] leading-relaxed text-dim">
          公式出自公众号「琳时闲话」《你距离“财务自由”有多远？》。若 Fn 为正，资本收益已覆盖生活开销——你自由了。
        </p>
      </div>
    </aside>
  );
}
