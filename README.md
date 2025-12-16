# 见微

[![Docker Build](https://github.com/chengtx809/insight/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/chengtx809/insight/actions/workflows/docker-publish.yml)
[![Release](https://github.com/chengtx809/insight/actions/workflows/release.yml/badge.svg)](https://github.com/chengtx809/insight/actions/workflows/release.yml)
<img width="1617" height="908" alt="image" src="https://github.com/user-attachments/assets/d8585236-c041-430c-847c-9b4a3c1aa83f" />

一个基于《数学之美》写作风格的AI教学文章生成工具，帮助用户创作深度、有趣、富有启发性的技术教学文章。

- “见微”取自成语“见微知著”，意为通过微小的细节（生活中的例子、轶事）洞察宏大的道理。这正是吴军老师擅长的"用生活化类比讲解抽象概念"的风格。
- Insight 意为洞察力，强调不仅仅是生成文字，更是生成有深度的见解和启发。

## ✨ 特色功能

### 🎯 吴军笔风还原
- **第一性原理思维**：从最基本的概念出发，层层递进
- **历史与现代交织**：用历史故事和科学家轶事引入概念
- **哲学与技术融合**：不仅讲技术，更讲背后的思想
- **生活化类比**：用贴切的比喻让抽象概念变得具体
- **口语化表达**：像和朋友聊天一样，深入浅出

### 🛠️ 强大功能
- **多LLM支持**：支持OpenAI GPT、Claude等主流AI模型
- **参数化定制**：根据知识点、受众、相关题目个性化生成
- **实时进度显示**：生成过程可视化，支持进度追踪
- **历史记录管理**：自动保存生成历史，支持搜索和批量操作
- **多格式导出**：支持Markdown、HTML等格式下载

## 🚀 快速开始

### 方式一：Docker 部署（推荐）

#### 使用预构建镜像
```bash
# 拉取最新镜像
docker pull ghcr.io/chengtx809/insight:latest

# 运行容器
docker run -d -p 3000:80 --name insight ghcr.io/chengtx809/insight:latest
```

#### 使用 Docker Compose
```bash
# 克隆项目
git clone https://github.com/chengtx809/insight.git
cd insight

# 启动服务
docker-compose up -d
```

访问 http://localhost:3000 即可使用应用。

### 方式二：本地开发

#### 环境要求
- Node.js 16+
- npm 或 yarn

#### 安装依赖
```bash
npm install
```

#### 启动开发服务器
```bash
npm run dev
```

#### 构建生产版本
```bash
npm run build
```

## 📖 使用指南

### 1. 配置LLM设置
- 选择预设配置或手动输入API端点
- 填写模型名称（如 gpt-4, claude-3-sonnet-20240229）
- 输入API密钥
- 调整温度和最大Token数（可选）
- 点击"测试连接"验证配置

### 2. 设置文章参数
- **知识点主题**：要讲解的核心概念（必填）
- **相关题目列表**：相关的练习题或案例（可选）
- **目标受众**：文章的读者群体（必填）

### 3. 生成文章
- 点击"生成吴军笔风文章"按钮
- 等待1-3分钟生成过程
- 查看生成的文章内容

### 4. 管理文章
- 在历史记录中查看所有生成的文章
- 支持搜索、批量下载、删除等操作
- 单篇文章可下载为Markdown或HTML格式

## 🎨 界面特色

### 现代化设计
- **玻璃拟态风格**：半透明卡片，毛玻璃效果
- **渐变背景**：优雅的色彩过渡
- **流畅动画**：页面切换和状态变化动画
- **响应式布局**：适配桌面和移动设备

### 用户体验
- **直观的标签导航**：生成、历史、设置三大功能区
- **实时状态反馈**：连接测试、生成进度、操作结果
- **智能表单验证**：输入检查和错误提示
- **快捷操作**：预设示例、批量操作、一键下载

## 🔧 技术栈

### 前端框架
- **React 18**：现代化React开发
- **TypeScript**：类型安全的JavaScript
- **Vite**：快速的构建工具

### UI组件
- **Tailwind CSS**：实用优先的CSS框架
- **Lucide React**：精美的图标库
- **自定义组件**：模块化的UI组件设计

### 功能库
- **date-fns**：日期处理
- **本地存储**：浏览器localStorage持久化
- **文件下载**：支持多种格式导出

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── LLMConfigForm.tsx      # LLM配置表单
│   ├── ArticleForm.tsx        # 文章参数表单
│   ├── GenerationProgress.tsx # 生成进度显示
│   ├── ArticleViewer.tsx      # 文章查看器
│   └── ArticleHistory.tsx     # 历史记录管理
├── services/           # 业务逻辑
│   └── llmService.ts          # LLM API调用服务
├── utils/              # 工具函数
│   ├── storage.ts             # 本地存储工具
│   └── download.ts            # 文件下载工具
├── types/              # TypeScript类型定义
│   └── index.ts
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🎯 支持的LLM模型

### OpenAI
- GPT-4 (推荐)
- GPT-3.5 Turbo
- 其他OpenAI兼容API

### Anthropic
- Claude 3 Sonnet
- Claude 3 Haiku
- Claude 3 Opus

### 其他
- 任何兼容OpenAI API格式的模型
- 本地部署的大语言模型

## 📝 文章生成特点

### 内容结构
1. **引子**（800-1000字）：历史故事引入
2. **主体章节**（3-5章）：层层递进讲解
3. **结语**（600-800字）：升华和总结

### 写作风格
- 从第一性原理出发
- 历史故事和现代技术结合
- 大量生活化类比
- 口语化但有深度的表达
- 注重思维方式的传达

### 质量保证
- 单篇不少于5000字
- 逻辑严密，层次分明
- 有具体示例和练习建议
- 升华到哲学和方法论层面

## 🔒 隐私安全

- **本地存储**：所有数据保存在浏览器本地
- **API密钥安全**：密钥仅用于API调用，不会上传
- **无服务器依赖**：纯前端应用，无需后端服务
- **数据控制**：用户完全控制自己的数据

## 🐳 Docker 部署

### 自动构建
每次推送到 `main` 分支时，GitHub Actions 会自动构建并发布 Docker 镜像到 GitHub Container Registry。

### 部署选项
- **Docker 单容器**：适合个人使用
- **Docker Compose**：适合本地开发和测试
- **Kubernetes**：适合生产环境集群部署

详细部署指南请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发环境设置
1. Fork本仓库
2. 克隆到本地：`git clone <your-fork>`
3. 安装依赖：`npm install`
4. 启动开发服务器：`npm run dev`
5. 创建功能分支进行开发
6. 提交Pull Request

### Docker 本地测试
```bash
# 构建镜像
docker build -t insight .

# 运行测试
docker run -d -p 3000:80 insight
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢吴军老师的《数学之美》等著作提供的写作风格灵感
- 感谢开源社区提供的优秀工具和库
- 感谢所有为改进这个项目做出贡献的开发者

---

**让每一个知识点都能用最优雅的方式传达给学习者** ✨
