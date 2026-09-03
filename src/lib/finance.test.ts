import { describe, expect, it } from "vitest";
import {
  PRESETS,
  computeResults,
  fmtSignedWan,
  fmtWan,
  sensitivityFn,
  type Params,
} from "./finance";

const base: Params = {
  C: 10_000_000,
  H: 300_000,
  Rw: 9,
  Rf: 3,
  useInflation: true,
  S: 10_000,
};

describe("computeResults · 核心公式 Fn = C×(Rw−Rf)−H", () => {
  it("经典案例：1000万 × (9%−3%) − 30万 = +30万/年，判定为已自由", () => {
    const r = computeResults(base);
    expect(r.ratePct).toBeCloseTo(6);
    expect(r.passive).toBeCloseTo(600_000);
    expect(r.fn).toBeCloseTo(300_000);
    expect(r.status).toBe("free");
    expect(r.fyFund).toBeCloseTo(600_000);
  });

  it("与敏感性公式口径一致", () => {
    const r = computeResults(base);
    expect(r.fn).toBeCloseTo(sensitivityFn(base.C, base.H, base.Rw, base.Rf));
  });

  it("所需资本 C* = H / (Rw−Rf) = 500万", () => {
    const r = computeResults({ ...base, C: 0 });
    expect(r.required).toBeCloseTo(5_000_000);
    expect(r.fn).toBeCloseTo(-300_000);
    expect(r.coverage).toBe(0);
    expect(r.status).toBe("far");
  });

  it("关闭通胀后使用简化公式 Fn = C×Rw − H", () => {
    const r = computeResults({ ...base, useInflation: false });
    expect(r.ratePct).toBeCloseTo(9);
    expect(r.fn).toBeCloseTo(10_000_000 * 0.09 - 300_000);
  });

  it("Fn 恰好为 0 时也算已自由（Fn ≥ 0）", () => {
    const r = computeResults({ ...base, H: 600_000 });
    expect(r.fn).toBeCloseTo(0);
    expect(r.status).toBe("free");
    expect(r.coverage).toBeCloseTo(1);
  });

  it("年开销为 0：立即自由，覆盖力为 null", () => {
    const r = computeResults({ ...base, H: 0 });
    expect(r.fn).toBeCloseTo(600_000);
    expect(r.status).toBe("free");
    expect(r.monthsCover).toBeNull();
  });
});

describe("computeResults · 边界与负数输入", () => {
  it("收益率 = 通胀率：所需资本为无穷大，不可能自由", () => {
    const r = computeResults({ ...base, Rw: 3 });
    expect(r.ratePct).toBeCloseTo(0);
    expect(r.required).toBe(Infinity);
    expect(r.fn).toBeCloseTo(-300_000);
    expect(r.status).not.toBe("free");
  });

  it("负收益率（Rw 为负）正常参与计算", () => {
    const r = computeResults({ ...base, Rw: -2 });
    expect(r.ratePct).toBeCloseTo(-5);
    expect(r.passive).toBeCloseTo(-500_000);
    expect(r.fn).toBeCloseTo(-800_000);
    expect(r.status).toBe("far");
  });

  it("负资本（负债）正常参与计算", () => {
    const r = computeResults({ ...base, C: -1_000_000 });
    expect(r.passive).toBeCloseTo(-60_000);
    expect(r.fn).toBeCloseTo(-360_000);
  });

  it("负通胀率（通缩）使实际收益率上升", () => {
    const r = computeResults({ ...base, Rf: -1 });
    expect(r.ratePct).toBeCloseTo(10);
    expect(r.fn).toBeCloseTo(700_000);
  });

  it("覆盖力 ≥ 0.66 判定为「临门一脚」", () => {
    const r = computeResults({ ...base, C: 3_500_000 });
    expect(r.coverage).toBeCloseTo(0.7);
    expect(r.status).toBe("close");
  });

  it("覆盖力 < 0.66 判定为「道阻且长」", () => {
    const r = computeResults({ ...base, C: 3_000_000 });
    expect(r.coverage).toBeCloseTo(0.6);
    expect(r.status).toBe("far");
  });

  it("被动收入覆盖力 = 年被动收入 ÷ 月开销（基础案例 = 24 个月）", () => {
    const r = computeResults(base);
    expect(r.monthsCover).toBeCloseTo(24);
  });

  it("部分覆盖：100 万资本 → 覆盖 2.4 个月开销", () => {
    const r = computeResults({ ...base, C: 1_000_000 });
    expect(r.monthsCover).toBeCloseTo(2.4);
  });
});

describe("computeResults · 资产推演", () => {
  it("从 0 起步靠储蓄推进，能找到自由临界年并在其后 6 年截断", () => {
    const r = computeResults({ ...base, C: 0, S: 20_000 });
    expect(r.crossYear).not.toBeNull();
    expect(r.crossYear).toBe(14);
    const last = r.points[r.points.length - 1];
    expect(last.year).toBe(r.crossYear! + 6);
    const cross = r.points.find((pt) => pt.year === r.crossYear)!;
    expect(cross.capital).toBeGreaterThanOrEqual(r.required);
  });

  it("永远无法达标时：crossYear 为 null，推演截断在第 40 年", () => {
    const r = computeResults({ ...base, C: 0, S: 0, Rw: 3 });
    expect(r.crossYear).toBeNull();
    expect(r.points[r.points.length - 1].year).toBe(40);
    expect(r.points[0]).toEqual({ year: 0, capital: 0 });
  });

  it("已自由时推演窗口为临界年+6（起点即达标 → 第 7 年）", () => {
    const r = computeResults(base);
    expect(r.crossYear).toBe(1);
    expect(r.points[r.points.length - 1].year).toBe(7);
  });
});

describe("fmtWan · 金额格式化", () => {
  it("亿级", () => {
    expect(fmtWan(150_000_000)).toBe("1.5 亿");
    expect(fmtWan(123_456_789)).toBe("1.23 亿");
  });
  it("万级", () => {
    expect(fmtWan(300_000)).toBe("30 万");
    expect(fmtWan(10_000)).toBe("1 万");
  });
  it("万元以下显示元", () => {
    expect(fmtWan(8_800)).toBe("8,800 元");
    expect(fmtWan(0)).toBe("0 元");
  });
  it("负数", () => {
    expect(fmtWan(-250_000)).toBe("-25 万");
  });
  it("万亿级（覆盖自由输入上限 10 万亿）", () => {
    expect(fmtWan(1e12)).toBe("1 万亿");
    expect(fmtWan(1.5e12)).toBe("1.5 万亿");
    expect(fmtWan(10e12)).toBe("10 万亿");
    expect(fmtWan(-2e12)).toBe("-2 万亿");
  });
});

describe("自由输入上限内的极端取值", () => {
  it("C=10万亿、Rw=1,000,000%、Rf=200% 时计算稳定且展示走万亿档", () => {
    const r = computeResults({ C: 10e12, H: 300_000, Rw: 1_000_000, Rf: 200, useInflation: true, S: 0 });
    expect(r.ratePct).toBe(999_800);
    expect(r.fn).toBeCloseTo(10e12 * 9_998 - 300_000);
    expect(r.status).toBe("free");
    expect(fmtWan(r.passive)).toBe("99,980,000 万亿");
  });
  it("H=1万亿、C=0 时 Fn 为大额负数", () => {
    const r = computeResults({ C: 0, H: 1e12, Rw: 8, Rf: 3, useInflation: true, S: 0 });
    expect(r.fn).toBe(-1e12);
    expect(fmtWan(Math.abs(r.fn))).toBe("1 万亿");
  });
});

describe("fmtSignedWan · 带符号格式化", () => {
  it("正数带 +，负数带 −，零带 ±", () => {
    expect(fmtSignedWan(300_000)).toBe("+30 万");
    expect(fmtSignedWan(-300_000)).toBe("−30 万");
    expect(fmtSignedWan(0)).toBe("±0 元");
  });
});

describe("sensitivityFn", () => {
  it("Fn = C×(Rw−Rf)−H", () => {
    expect(sensitivityFn(10_000_000, 300_000, 9, 3)).toBeCloseTo(300_000);
    expect(sensitivityFn(10_000_000, 300_000, 3, 3)).toBeCloseTo(-300_000);
  });
});

describe("PRESETS · 预设不变量", () => {
  it("所有预设的通胀率固定为 3%", () => {
    for (const pre of PRESETS) {
      expect(pre.values.Rf).toBe(3);
    }
  });
  it("预设名称不体现「文中」，且 id 唯一", () => {
    const ids = new Set<string>();
    for (const pre of PRESETS) {
      expect(pre.name).not.toContain("文中");
      expect(ids.has(pre.id)).toBe(false);
      ids.add(pre.id);
    }
  });
  it("预设参数均为合法数值", () => {
    for (const pre of PRESETS) {
      const v = pre.values;
      expect(Number.isFinite(v.C)).toBe(true);
      expect(Number.isFinite(v.H)).toBe(true);
      expect(Number.isFinite(v.Rw)).toBe(true);
      expect(Number.isFinite(v.S)).toBe(true);
      expect(v.H).toBeGreaterThan(0);
    }
  });
});
