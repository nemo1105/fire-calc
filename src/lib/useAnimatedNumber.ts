import { useEffect, useRef, useState } from "react";

/** 数值平滑过渡动画（easeOutCubic） */
export function useAnimatedNumber(target: number, duration = 650): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!Number.isFinite(target)) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = Number.isFinite(fromRef.current) ? fromRef.current : target;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setValue(v);
      fromRef.current = v;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
