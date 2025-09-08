# 更新日志

## v0.3.10 (2025-09-08)

### 🐞 修复
- 修复快捷键提交无法带上用户输入与勾选选项的问题：统一在父组件执行 `forceSync + getCurrentData` 后再判定与构建响应，避免状态滞后导致的数据丢失。涉及：
  - `src/frontend/components/popup/PopupActions.vue`
  - `src/frontend/components/popup/McpPopup.vue`

### 🧪 测试
- 新增 Vitest 配置与单测，验证“快捷键提交使用子组件最新快照”。
  - 配置：`vitest.config.ts`
  - 用例：`src/frontend/components/popup/__tests__/shortcut-submit.spec.ts`

### 📦 其他
- 版本号同步为 `0.3.10`：`package.json`、`Cargo.toml`、`tauri.conf.json`、`version.json`

### 🧾 提交历史（自 v0.3.8 起）
- fa511df fix(popup): 快捷键提交/增强前拉取最新输入与选项快照，修复数据未同步问题
- 008f8cc fix(version): Web 开发/预览环境读取 version.json 作为兜底，校正显示为 v0.3.8
- ff1e8e3 docs: 添加贡献指南 AGENTS.md
