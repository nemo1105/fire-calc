export type Lang = "zh" | "en";

export const translations = {
  zh: {
    // Header
    title: "财务自由计算器",
    subtitle: "调一调四个变量：当 Fn 为正，资本收益已能覆盖体面生活的开销—— 那一刻，你便获得了财务自由。",
    
    // InputsPanel
    inputsTitle: "参数 · 四个变量",
    inputsSubtitle: "拖动滑杆快捷调节 · 点击数字可自由编辑——支持清空重输与负数，回车确认 / Esc 取消",
    presetsTitle: "预设场景 · Presets",
    capitalTotal: "资本总量",
    capitalHint: "可用于投资产生收益的财富（现金、基金、收租资产等）",
    capitalUnit: "万元",
    happinessThreshold: "幸福感阈值 · 年开销",
    happinessHint: "维持你体面生活所必须的年净开销",
    happinessUnit: "万元/年",
    investmentReturn: "投资收益率",
    investmentHint: "银行理财、股票基金、房屋租金等综合年化收益",
    investmentUnit: "%",
    considerInflation: "考虑通胀稀释",
    inflationOff: "关闭后公式简化为 Fn = C×Rw − H",
    inflationRate: "社会通胀率",
    inflationHint: "你的财富总量被稀释的速度",
    inflationUnit: "%",
    monthlySavings: "推演辅助 · 每月储蓄",
    monthlySavingsTitle: "每月新增储蓄",
    monthlySavingsHint: "仅用于下方资产推演图，不计入 Fn 公式",
    monthlySavingsUnit: "元/月",
    currentAnnualSavings: "当前年储蓄 ≈",
    fnPositive: "若 Fn 为正，资本收益已覆盖生活开销——你自由了。",
    inputLimits: "自由输入上限：C ≤ 10万亿 · H ≤ 1万亿 · Rw ≤ 1,000,000% · Rf ≤ 200% · 月储蓄 ≤ 1,000万",
    
    // Presets
    presetClassic: "经典案例",
    presetClassicDesc: "1000万资本 · 年开销30万 · 收益9% · 通胀3%",
    presetLean: "低物欲生活",
    presetLeanDesc: "控制物欲，离自由更近一步",
    presetDecent: "体面中产",
    presetDecentDesc: "维持良好生活质量的年开销",
    presetRich: "高配人生",
    presetRichDesc: "更高的幸福阈值，更大的资本盘",
    
    // ResultHero
    financialFreedomIndex: "财务自由指数 Fn",
    free: "已自由",
    almost: "临门一脚",
    onward: "道阻且长",
    derivation: "推演明细",
    formula: "公式",
    capitalLabel: "C · 资本总量",
    actualReturn: "实际收益率",
    nominalReturn: "名义收益率",
    output: "产出",
    annualPassive: "年被动收入",
    annualExpense: "H · 年开销",
    fnResult: "Fn · 财务自由指数",
    freeNote: "为正即已自由",
    notFreeNote: "为正之前，继续积累",
    freeDesc: "你的资本收益在覆盖全年开销后，每年还富余",
    notFreeDesc: "距离自由每年还差",
    requiredCapital: "目标资本",
    accelerate: "降低 H、提高 Rw，或继续积累 C，都能加速抵达。",
    inflationWarning: "⚠ 收益率跑不赢通胀（Rw ≤ Rf），资本购买力正在缩水——先让收益跑赢印钞机。",
    coverageRate: "目标资本达成率 C / C*",
    requiredCapitalLabel: "所需资本 C* = H/(Rw−Rf)",
    stillNeed: "还差",
    achieved: "已达标",
    noSolution: "收益 ≤ 通胀，无解",
    passiveCoverage: "被动收入覆盖力",
    noPositiveReturn: "无正收益",
    months: "个月",
    coverageDesc1: "先让收益率为正",
    coverageDesc2: "被动收入已覆盖全年开销",
    coverageDesc3: "相当于全年开销的",
    fyFund: "Fuck You 基金 ≈ 2年开销",
    fyFundDesc: "随时对生活说「不」的底气",
    
    // ProjectionChart
    projectionTitle: "资产推演 · 通往自由之路",
    projectionSubtitle: "按当前收益率与每月储蓄推演未来 60 年资产曲线",
    assetCurve: "资产曲线",
    freedomLine: "自由线",
    year: "年",
    asset: "资产",
    freedom: "自由",
    yearsToFreedom: "第 {0} 年 · 自由",
    noFreedomIn40: "40 年内无法达标",
    
    // SensitivityGrid
    sensitivityTitle: "Rw × Rf 敏感性沙盘",
    sensitivitySubtitle: "点击任意格子试算，直观展示通胀是沉默的财富小偷",
    rwLabel: "Rw · 投资收益率",
    rfLabel: "Rf · 社会通胀率",
    clickToTest: "点击任意格子试算",
    
    // TiersLadder
    tiersTitle: "自由段位阶梯",
    tiersSubtitle: "网传「九段自由」· 以你的资本总量 C 判定 · 已点亮",
    nextTier: "下一段",
    unlocked: "已解锁 ✓",
    tierNote: "* 段位门槛为网络流传说法的整理，仅供参照娱乐；真正的标准，由你的 H 说了算。",
    
    // Tiers names
    tierMarket: "菜场自由",
    tierDining: "餐饮自由",
    tierWardrobe: "穿衣自由",
    tierTravel: "旅行自由",
    tierCar: "汽车自由",
    tierHome: "住房自由",
    tierEdu: "教育自由",
    tierHealth: "医疗自由",
    tierTrue: "终极自由",
    
    // Footer
    footerQuote: "财务自由最初的目的，无非是让自己在成年人的世界里免于恐惧，求得一个心中安稳而已。",
    actionClues: "三条行动线索",
    clue1: "降低 H：低物欲生活，立刻离自由更近一步。",
    clue2: "提高 Rw：让收益跑赢通胀 Rf，资本才不缩水。",
    clue3: "做大 C：持续储蓄与投资，静待复利越过自由线。",
    disclaimer: "本工具仅基于公式做数学推演，不构成任何投资建议。若多少金钱都难以解除焦虑——金钱解决不了的问题，答案也只会在金钱之外。",
    motto: "以今日之算，安明日之心",
    
    // Common
    yuan: "元",
    wan: "万",
    yi: "亿",
    wanYi: "万亿",
    perYear: "/年",
    perMonth: "/月",
  },
  
  en: {
    // Header
    title: "Financial Freedom Calculator",
    subtitle: "Adjust the four variables: when Fn is positive, your capital returns can cover a decent life — that moment, you are financially free.",
    
    // InputsPanel
    inputsTitle: "Parameters · Four Variables",
    inputsSubtitle: "Drag sliders for quick adjustment · Click numbers to edit freely — supports clearing, negative values, Enter to confirm / Esc to cancel",
    presetsTitle: "Presets",
    capitalTotal: "Total Capital",
    capitalHint: "Wealth available for investment (cash, funds, rental assets, etc.)",
    capitalUnit: "10K",
    happinessThreshold: "Happiness Threshold · Annual Expense",
    happinessHint: "Annual net expense to maintain a decent life",
    happinessUnit: "10K/year",
    investmentReturn: "Investment Return Rate",
    investmentHint: "Comprehensive annual return from bank wealth management, stock funds, rental income, etc.",
    investmentUnit: "%",
    considerInflation: "Consider Inflation Dilution",
    inflationOff: "When off, formula simplifies to Fn = C×Rw − H",
    inflationRate: "Social Inflation Rate",
    inflationHint: "The speed at which your wealth is diluted",
    inflationUnit: "%",
    monthlySavings: "Projection Aid · Monthly Savings",
    monthlySavingsTitle: "Monthly New Savings",
    monthlySavingsHint: "Only used for asset projection chart below, not included in Fn formula",
    monthlySavingsUnit: "/month",
    currentAnnualSavings: "Current annual savings ≈",
    fnPositive: "If Fn is positive, capital returns have covered living expenses — you are free.",
    inputLimits: "Input limits: C ≤ 10T · H ≤ 1T · Rw ≤ 1,000,000% · Rf ≤ 200% · Monthly savings ≤ 10M",
    
    // Presets
    presetClassic: "Classic Case",
    presetClassicDesc: "10M capital · 300K annual expense · 9% return · 3% inflation",
    presetLean: "Minimalist Life",
    presetLeanDesc: "Control desires, get closer to freedom",
    presetDecent: "Decent Middle Class",
    presetDecentDesc: "Annual expense for good quality of life",
    presetRich: "Luxury Life",
    presetRichDesc: "Higher happiness threshold, larger capital base",
    
    // ResultHero
    financialFreedomIndex: "Financial Freedom Index Fn",
    free: "FREE",
    almost: "ALMOST",
    onward: "ONWARD",
    derivation: "Derivation",
    formula: "Formula",
    capitalLabel: "C · Total Capital",
    actualReturn: "Actual Return Rate",
    nominalReturn: "Nominal Return Rate",
    output: "Output",
    annualPassive: "Annual Passive Income",
    annualExpense: "H · Annual Expense",
    fnResult: "Fn · Freedom Index",
    freeNote: "Positive means free",
    notFreeNote: "Keep accumulating until positive",
    freeDesc: "After covering annual expenses, your capital returns still have a surplus of",
    notFreeDesc: "Still short of freedom by",
    requiredCapital: "Required capital",
    accelerate: "Lower H, increase Rw, or accumulate C to accelerate arrival.",
    inflationWarning: "⚠ Return rate can't beat inflation (Rw ≤ Rf), capital purchasing power is shrinking — make returns beat the money printer first.",
    coverageRate: "Target Capital Achievement Rate C / C*",
    requiredCapitalLabel: "Required Capital C* = H/(Rw−Rf)",
    stillNeed: "Still need",
    achieved: "Achieved",
    noSolution: "Return ≤ Inflation, no solution",
    passiveCoverage: "Passive Income Coverage",
    noPositiveReturn: "No positive return",
    months: "months",
    coverageDesc1: "Make return rate positive first",
    coverageDesc2: "Passive income covers annual expenses",
    coverageDesc3: "Equivalent to",
    fyFund: "Fuck You Fund ≈ 2 years expense",
    fyFundDesc: "Courage to say 'no' to life anytime",
    
    // ProjectionChart
    projectionTitle: "Asset Projection · Path to Freedom",
    projectionSubtitle: "Project 60-year asset curve based on current return rate and monthly savings",
    assetCurve: "Asset Curve",
    freedomLine: "Freedom Line",
    year: "Year",
    asset: "Asset",
    freedom: "Freedom",
    yearsToFreedom: "Year {0} · Freedom",
    noFreedomIn40: "Can't reach target within 40 years",
    
    // SensitivityGrid
    sensitivityTitle: "Rw × Rf Sensitivity Sandbox",
    sensitivitySubtitle: "Click any cell to test, intuitively showing inflation is the silent wealth thief",
    rwLabel: "Rw · Investment Return",
    rfLabel: "Rf · Social Inflation",
    clickToTest: "Click any cell to test",
    
    // TiersLadder
    tiersTitle: "Freedom Tiers Ladder",
    tiersSubtitle: "Internet-famous 'Nine Tiers of Freedom' · Judged by your total capital C · Unlocked",
    nextTier: "Next tier",
    unlocked: "Unlocked ✓",
    tierNote: "* Tier thresholds are compiled from internet rumors, for reference only; the real standard is determined by your H.",
    
    // Tiers names
    tierMarket: "Market Freedom",
    tierDining: "Dining Freedom",
    tierWardrobe: "Wardrobe Freedom",
    tierTravel: "Travel Freedom",
    tierCar: "Car Freedom",
    tierHome: "Housing Freedom",
    tierEdu: "Education Freedom",
    tierHealth: "Healthcare Freedom",
    tierTrue: "Ultimate Freedom",
    
    // Footer
    footerQuote: "The original purpose of financial freedom is nothing more than allowing oneself to be free from fear in the adult world, seeking a sense of peace of mind.",
    actionClues: "Three Action Clues",
    clue1: "Lower H: Minimalist life, get closer to freedom immediately.",
    clue2: "Increase Rw: Let returns beat inflation Rf, so capital doesn't shrink.",
    clue3: "Grow C: Continuous savings and investment, wait patiently for compound interest to cross the freedom line.",
    disclaimer: "This tool is only mathematical projection based on the formula, not investment advice. If no amount of money can relieve anxiety — the answer to problems money can't solve can only be found beyond money.",
    motto: "Today's calculation, tomorrow's peace of mind",
    
    // Common
    yuan: "",
    wan: "10K",
    yi: "100M",
    wanYi: "10T",
    perYear: "/year",
    perMonth: "/month",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] || translations.zh[key];
}

export function detectLanguage(): Lang {
  if (typeof window === "undefined") return "zh";
  const lang = navigator.language || (navigator as any).userLanguage;
  if (lang && lang.toLowerCase().startsWith("zh")) return "zh";
  return "en";
}
