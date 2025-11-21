# 🇬🇧 English Buddy - AI Kids Learning Assistant

![English Buddy Banner](https://via.placeholder.com/1200x400/8EC5FC/FFFFFF?text=English+Buddy+App)

**English Buddy** 是一个专为儿童设计的 AI 英语学习助手。它界面生动有趣，使用 Google Gemini 模型来分析英语句子，提供适合儿童理解的中文翻译、语法讲解、短语分析，并给予鼓励。

## ✨ 功能特性 (Features)

*   **👶 儿童友好设计**: 采用鲜艳的色彩（品牌蓝、紫、黄、粉）、圆角卡片和俏皮的字体。
*   **🤖 AI 智能分析**:
    *   **精准翻译**: 将英文句子翻译成地道的中文。
    *   **语法小讲堂**: 自动识别语法点，用简单的语言解释（如过去式、复数等）。
    *   **重点词汇**: 提取关键短语和生词，提供解释。
    *   **难度分级**: 自动评估句子的难度（初级、中级、高级）。
*   **📄 导出功能**:
    *   **PDF 导出**: 将精美的分析报告保存为 PDF 图片格式。
    *   **文本导出**: 将分析结果保存为纯文本文件，包含原文与解析。
*   **⚡ 实时响应**: 快速的分析速度和加载动画。

## 🛠️ 技术栈 (Tech Stack)

*   **框架**: [React 19](https://react.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **样式**: [Tailwind CSS](https://tailwindcss.com/) (目前通过 CDN 引入，方便快速原型开发)
*   **AI 模型**: [Google Gemini API](https://ai.google.dev/) (@google/genai)
*   **图标**: [Lucide React](https://lucide.dev/)
*   **工具库**: `html2canvas` (截图), `jspdf` (生成 PDF)

## 🚀 快速开始 (Quick Start)

### 1. 准备工作 (Prerequisites)

*   Node.js (v18 或更高版本)
*   一个 Google Gemini API Key ([点击获取](https://aistudio.google.com/app/apikey))

### 2. 安装依赖 (Installation)

```bash
# 克隆仓库 (如果您尚未下载)
git clone https://github.com/your-username/english-buddy.git
cd english-buddy

# 安装 NPM 依赖
npm install
```

### 3. 配置环境变量 (Configuration)

在项目根目录下创建一个 `.env` 文件，并填入您的 API Key：

```env
# .env
API_KEY=your_google_gemini_api_key_here
```

> **注意**: 请勿将包含真实 Key 的 `.env` 文件提交到 GitHub。

### 4. 启动开发服务器 (Running Locally)

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可使用。

### 5. 构建生产版本 (Building for Production)

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 📂 项目结构 (Project Structure)

```
english-buddy/
├── components/          # React 组件
│   ├── Header.tsx       # 顶部 Logo 和 Slogan
│   ├── InputArea.tsx    # 输入框组件
│   └── AnalysisResults.tsx # 分析结果显示及导出逻辑
├── services/
│   └── geminiService.ts # Gemini API 调用逻辑
├── types.ts             # TypeScript 类型定义
├── App.tsx              # 主应用入口
├── index.tsx            # React 渲染入口
├── vite.config.ts       # Vite 配置
└── package.json         # 依赖管理
```

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request 来改进这个项目！无论是修复 Bug 还是增加新功能，我们都非常欢迎。

## 📄 许可证 (License)

MIT License
