# 寸止

基于 MCP (Model Context Protocol) 的智能交互工具，提供弹窗交互和全局记忆管理功能。

## ✨ 核心特性

- 🎯 **MCP 标准兼容** - 完全符合 MCP 协议规范
- 🎨 **现代化UI** - Vue 3 + Naive UI 美观界面
- 🛠️ **智能交互** - 支持预定义选项、文本输入、图片上传
- 🧠 **记忆管理** - 按项目存储开发规范和偏好设置
- 🖥️ **跨平台** - 基于 Tauri 2.0 支持 Windows/macOS/Linux

## 📸 功能演示

### 智能弹窗界面

![寸止 弹窗演示](./screenshots/demo.png)

_寸止 的现代化弹窗界面，支持 Markdown 渲染、代码高亮、预定义选项和自由文本输入_

## 🚀 快速安装

从 [Releases](https://github.com/imhuso/ai-review/releases) 页面下载对应平台的预编译版本：

- **Linux**: `cunzhi-cli-v*-linux-x86_64.tar.gz`
- **macOS (Intel)**: `cunzhi-cli-v*-macos-x86_64.tar.gz`
- **macOS (Apple Silicon)**: `cunzhi-cli-v*-macos-aarch64.tar.gz`
- **Windows**: `cunzhi-cli-v*-windows-x86_64.zip`

**安装步骤**：
1. 下载并解压对应平台的压缩包
2. 将 `寸止` 和 `等一下` 工具添加到 PATH 或使用绝对路径

## 📋 配置使用

### MCP 客户端配置

```json
{
  "mcpServers": {
    "寸止": {
      "command": "寸止"
    }
  }
}
```

### 工具说明

- **寸止**：MCP服务器，处理AI客户端请求
- **等一下**：弹窗界面，提供用户交互和设置管理

## 🛠️ MCP 工具

### 智能交互工具
支持弹窗交互、Markdown渲染、图片上传和预定义选项

### 记忆管理工具
按项目存储开发规范和偏好设置，支持智能分类管理

## 📋 使用方法

启动 MCP 服务器：
```bash
寸止
```

启动弹窗界面：
```bash
等一下  # 设置界面
```

### 📝 推荐提示词

在设置界面的"参考提示词"标签页中，您可以：

- **查看推荐提示词** - 基于启用的MCP工具动态生成的系统提示词
- **一键复制** - 点击复制按钮将提示词添加到您的AI助手中
- **实时更新** - 提示词内容会根据MCP工具开关设置自动调整

> 💡 **使用建议**：将生成的提示词添加到您的AI助手（如Claude、ChatGPT等）的系统提示中，以获得最佳的交互体验和功能支持。

## 🧪 开发

### 环境要求
- Rust 1.70+
- Node.js 18+
- pnpm

### 本地开发
```bash
git clone https://github.com/imhuso/cunzhi.git
cd cunzhi
pnpm install
pnpm tauri:dev
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
