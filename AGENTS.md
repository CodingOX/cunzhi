# Repository Guidelines

本仓库是基于 Tauri 2 + Rust 后端与 Vue 3 + Vite 前端的跨平台桌面应用与命令行工具集合。

## 项目结构与模块组织
- 源码：`src/rust`（核心逻辑、MCP/Telegram、UI/配置/常量），`src/frontend`（Vue 组件、主题、常量、测试页面）。
- 资源与配置：`icons/`、`screenshots/`、`tauri.conf.json`、`vite.config.js`、`uno.config.ts`、`eslint.config.mjs`。
- 包管理与构建：`Cargo.toml`（Rust）、`package.json` + `pnpm-lock.yaml`（前端）。

示例路径：`src/rust/app/cli.rs`、`src/rust/mcp/`、`src/frontend/components/`、`src/frontend/test/`。

## 构建、测试与本地开发
- 开发前端：`pnpm dev`（Vite 开发服务器，端口 5176）。
- Tauri 调试：`pnpm tauri:dev`（启动桌面应用，串联前端与 Rust）。
- 生产构建：`pnpm build`（前端）；`pnpm tauri:build`（打包桌面应用）。
- 预览构建：`pnpm preview`。
- 代码校验：`pnpm lint`。
- UI 手测页：`pnpm test:ui` 或 `pnpm test:ui:build`（位于 `src/frontend/test/`）。

## 编码风格与命名约定
- 前端：遵循 ESLint `@antfu` 规则，建议 2 空格缩进、单引号、按需导入；组件采用 `PascalCase.vue`，变量 `camelCase`，常量 `UPPER_SNAKE_CASE`。
- Rust：遵循 `rustfmt` 默认风格，模块/文件使用 `snake_case`，公共 API 文档注释使用 `///`。
- 样式：使用 UnoCSS，语义化颜色定义见 `src/frontend/theme/`。

## 测试规范
- 当前以手动/可视测试为主（`src/frontend/test/`）；提交前请在主要交互路径（弹窗、设置、MCP 工具、Telegram）完成回归。
- 建议：新增关键逻辑时同步补充最小复现页面或脚本示例。

## 提交与 Pull Request
- 提交信息：采用 Conventional Commits，如 `feat: 新增弹窗快捷键`、`fix: 修复 Telegram 授权失败`（参见 `cliff.toml`）。
- PR 要求：简述变更、关联 Issue、必要截图（放入 `screenshots/`）、风险与验证步骤；确保通过 `pnpm lint` 与本地构建。

## 安全与配置提示（可选）
- 机密信息（如 Telegram Token）请通过应用设置或环境变量配置，勿硬编码/入库；前端可使用 `VITE_`/`TAURI_` 前缀变量。
- 参考 CI 工作流了解跨平台依赖与打包流程（`.github/workflows/`）。

