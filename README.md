# fire-calc

财务自由计算器 —— 基于公式 **Fn = C × (Rw − Rf) − H**（资本总量 × 实际收益率 − 年开销）。

Fn 为正，即已财务自由。

## 本地开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run typecheck
npx vitest run   # 单元测试（src/lib/finance.test.ts：公式、边界、负数、格式化、预设）
```

## 部署到 GitHub Pages

项目已内置 GitHub Actions 工作流，推送到 `main`（或 `master`）分支即自动构建并部署。

**首次启用（一次性配置）：**

1. 将代码推送到 GitHub 仓库。
2. 打开仓库页面 **Settings → Pages**。
3. **Build and deployment → Source** 选择 **GitHub Actions**。
4. 推送 `main` 分支（或在 **Actions** 页手动运行 *Deploy to GitHub Pages*）。
5. 部署完成后访问 `https://<你的用户名>.github.io/<仓库名>/`。

**工作流说明：**

| 文件 | 作用 | 触发 |
| --- | --- | --- |
| `.github/workflows/deploy.yml` | 构建 + 部署到 Pages（构建时使用 `--base=./` 以适配子路径） | 推送 `main` / `master`、手动触发 |
| `.github/workflows/ci.yml` | 类型检查 + 构建验证 | PR、非主分支推送 |

> 若 Pages 仍显示 404，请确认 Source 已切换为 **GitHub Actions**（而非 "Deploy from a branch"）。
