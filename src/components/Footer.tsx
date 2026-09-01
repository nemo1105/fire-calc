export default function Footer() {
  return (
    <footer className="relative z-10 mt-14 border-t border-line-soft">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <blockquote className="relative">
            <svg width="34" height="26" viewBox="0 0 34 26" className="text-gold/70" fill="currentColor" aria-hidden>
              <path d="M0 26V14.6C0 6.5 4.8 1.3 13.2 0l1.6 4.5c-4.6 1.3-7 3.9-7.2 7.6H14V26H0Zm20 0V14.6C20 6.5 24.8 1.3 33.2 0l.8 4.5c-4.6 1.3-7 3.9-7.2 7.6H34V26H20Z" transform="scale(0.95)" />
            </svg>
            <p className="mt-3 font-display text-[22px] leading-relaxed tracking-wide text-cream sm:text-[26px]">
              财务自由最初的目的，无非是让自己在成年人的世界里
              <span className="text-gold-soft">免于恐惧</span>，求得一个
              <span className="text-jade">心中安稳</span>而已。
            </p>
            <cite className="mt-3 block font-mono text-[11px] not-italic tracking-[0.2em] text-dim">
              —— 琳时闲话《你距离“财务自由”有多远？》
            </cite>
          </blockquote>

          <div className="space-y-4 text-[12.5px] leading-relaxed text-mist">
            <div className="rounded-md border border-line-soft bg-pine-900/60 p-4">
              <p className="mb-1.5 font-bold text-cream">三条行动线索</p>
              <ul className="space-y-1.5">
                <li className="flex gap-2"><span className="text-gold">壹</span>降低 H：低物欲生活，立刻离自由更近一步。</li>
                <li className="flex gap-2"><span className="text-gold">贰</span>提高 Rw：让收益跑赢通胀 Rf，资本才不缩水。</li>
                <li className="flex gap-2"><span className="text-gold">叁</span>做大 C：持续储蓄与投资，静待复利越过自由线。</li>
              </ul>
            </div>
            <p className="text-[11px] leading-relaxed text-dim">
              本工具仅基于文章公式做数学推演，不构成任何投资建议。若多少金钱都难以解除焦虑——金钱解决不了的问题，答案也只会在金钱之外。
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line-soft pt-5 font-mono text-[10.5px] tracking-[0.14em] text-dim">
          <span>Fn = C × (Rw − Rf) − H &nbsp;·&nbsp; FIRE INDEX CALCULATOR</span>
          <span>以今日之算，安明日之心</span>
        </div>
      </div>
    </footer>
  );
}
