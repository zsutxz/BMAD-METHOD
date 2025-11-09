# BMad CORE + BMad 方法

[![稳定版本](https://img.shields.io/npm/v/bmad-method?color=blue&label=stable)](https://www.npmjs.com/package/bmad-method)
[![Alpha版本](https://img.shields.io/npm/v/bmad-method/alpha?color=orange&label=alpha)](https://www.npmjs.com/package/bmad-method)
[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js版本](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

> **🚨 Alpha版本通知**
>
> v6-alpha版本接近测试版质量——稳定且相比v4版本有了大幅改进，但文档仍在完善中。新视频即将发布到[BMadCode YouTube频道](https://www.youtube.com/@BMadCode)——订阅获取更新！
>
> **快速入门：**
>
> - **安装v6 Alpha：** `npx bmad-method@alpha install`
> - **安装稳定v4：** `npx bmad-method install`
> - **不确定该做什么？** 加载任意代理并运行`*workflow-init`获取指导设置
> - **v4用户：** [查看v4文档](https://github.com/bmad-code-org/BMAD-METHOD/tree/V4)或[升级指南](./docs/v4-to-v6-upgrade.md)

## 通用人机协作平台

**BMad-CORE**（**C**ollaboration **O**ptimized **R**eflection **E**ngine，协作优化反思引擎）通过专业化AI代理放大人类潜能。与替代思考的工具不同，BMad-CORE引导反思性工作流程，激发您的最佳想法和AI的完整能力。

**BMad-CORE**驱动**BMad方法**（可能就是您来这里的原因！），但您也可以使用**BMad Builder**创建任意领域的自定义代理、工作流程和模块——软件开发、商业策略、创意、学习等。

**🎯 人类增强** • **🎨 领域无关** • **⚡ 代理驱动**

## 目录

- [BMad CORE + BMad方法](#bmad-core--bmad方法)
  - [通用人机协作平台](#通用人机协作平台)
  - [目录](#目录)
  - [什么是BMad-CORE？](#什么是bmad-core)
    - [v6核心增强](#v6核心增强)
    - [C.O.R.E.理念](#core理念)
  - [模块](#模块)
    - [BMad方法(BMM) - AI驱动的敏捷开发](#bmad方法bmm---ai驱动的敏捷开发)
      - [v6亮点](#v6亮点)
  - [🚀快速入门](#-快速入门)
    - [BMad Builder(BMB) - 创建自定义解决方案](#bmad-builderbmb---创建自定义解决方案)
    - [Creative Intelligence Suite(CIS) - 创新与创意](#creative-intelligence-suitecis---创新与创意)
  - [安装](#安装)
  - [🎯 使用代理和命令](#-使用代理和命令)
    - [方法1：代理菜单（推荐初学者）](#方法1代理菜单推荐初学者)
    - [方法2：直接斜杠命令](#方法2直接斜杠命令)
    - [方法3：派对模式执行](#方法3派对模式执行)
  - [关键特性](#关键特性)
    - [🎨 更新安全的自定义](#-更新安全的自定义)
    - [🚀 智能安装](#-智能安装)
    - [📁 清洁架构](#-清洁架构)
    - [📄 文档分片（高级）](#-文档分片高级)
  - [文档](#文档)
  - [社区与支持](#社区与支持)
  - [开发与质量检查](#开发与质量检查)
    - [测试与验证](#测试与验证)
    - [代码质量](#代码质量)
    - [构建与开发](#构建与开发)
  - [贡献](#贡献)
  - [许可证](#许可证)

---

## 什么是BMad-CORE？

驱动所有BMad模块的基础框架：

- **代理编排** - 具有领域专业知识的专业化AI角色
- **工作流引擎** - 具有内置最佳实践的引导性多步骤流程
- **模块化架构** - 通过领域特定模块扩展（BMM、BMB、CIS、自定义）
- **IDE集成** - 适用于Claude Code、Cursor、Windsurf、VS Code等
- **更新安全自定义** - 您的配置在所有更新中保持持久

### v6核心增强

- **🎨 代理自定义** - 通过`bmad/_cfg/agents/`修改名称、角色、个性
- **🌐 多语言** - 交流和输出的独立语言设置
- **👤 个性化** - 代理适应您的姓名、技能水平和偏好
- **🔄 持久配置** - 自定义在模块更新中保持存在
- **⚙️ 灵活设置** - 每模块或全局配置

### C.O.R.E.理念

- **C**ollaboration（协作）：利用互补优势的人机伙伴关系
- **O**ptimized（优化）：为最大效果而经过实战验证的流程
- **R**eflection（反思）：解锁突破性解决方案的策略性提问
- **E**ngine（引擎）：编排19+专业代理和50+工作流程的框架

BMad-CORE不直接给您答案——它通过引导反思帮助您**发现更好的解决方案**。

## 模块

### BMad方法(BMM) - AI驱动的敏捷开发

革命性的AI驱动敏捷框架，用于软件和游戏开发。自动适应从单个错误修复到企业级系统的各种规模。

#### v6亮点

**🎯 规模自适应智能（3个规划轨道）**

根据项目需求自动调整规划深度和文档：

- **快速流程轨道：** 快速实现（仅需技术规范）- 错误修复、小功能、明确范围
- **BMad方法轨道：** 完整规划（PRD + 架构 + UX）- 产品、平台、复杂功能
- **企业方法轨道：** 扩展规划（BMad方法 + 安全/DevOps/测试）- 企业需求、合规

**🏗️ 四阶段方法论**

1. **阶段1：分析**（可选）- 头脑风暴、研究、产品简介
2. **阶段2：规划**（必需）- 规模自适应PRD/技术规范/GDD
3. **阶段3：解决方案**（轨道依赖）- 架构，（即将推出：安全、DevOps、测试策略）
4. **阶段4：实现**（迭代）- 以故事为中心的即时上下文开发

**🤖 12个专业代理**

项目经理（PM）• 分析师 • 架构师 • Scrum主管 • 开发人员 • 测试架构师（TEA）• UX设计师 • 技术写作者 • 游戏设计师 • 游戏开发人员 • 游戏架构师 • BMad主控（编排者）

**📚 文档**

- **[完整文档中心](./src/modules/bmm/docs/README.md)** - 所有BMM指南的起点
- **[快速入门指南](./src/modules/bmm/docs/quick-start.md)** - 15分钟内开始构建
- **[代理指南](./src/modules/bmm/docs/agents-guide.md)** - 认识所有12个代理（45分钟阅读）
- **[34个工作流指南](./src/modules/bmm/docs/README.md#-workflow-guides)** - 完整分阶段参考
- **[BMM模块概述](./src/modules/bmm/README.md)** - 模块结构和快速链接

---

## 🚀 快速入门

**安装后**（见下方[安装](#安装)），选择您的路径：

**三个规划轨道：**

1. **⚡ 快速流程轨道** - 错误修复和小功能
   - 🐛 几分钟内修复错误
   - ✨ 小功能（2-3个相关更改）
   - 🚀 快速原型制作
   - **[→ 快速规范流程指南](./src/modules/bmm/docs/quick-spec-flow.md)**

2. **📋 BMad方法轨道** - 产品和平台
   - 完整规划（PRD/GDD）
   - 架构决策
   - 以故事为中心的实现
   - **[→ 完整快速入门指南](./src/modules/bmm/docs/quick-start.md)**

3. **🏢 棕地项目** - 添加到现有代码库
   - 首先记录现有代码
   - 然后选择快速流程或BMad方法
   - **[→ 棕地指南](./src/modules/bmm/docs/brownfield-guide.md)**

**不确定选择哪个路径？** 运行`*workflow-init`让BMM分析您的项目目标并推荐正确的轨道。

**[📚 了解更多：规模自适应系统](./src/modules/bmm/docs/scale-adaptive-system.md)** - BMM如何在三个规划轨道中自适应

---

### BMad Builder(BMB) - 创建自定义解决方案

使用BMad-CORE框架构建您自己的代理、工作流程和模块。

**您可以构建什么：**

- **自定义代理** - 具有专业知识的专业领域专家
- **引导工作流程** - 任何任务的多步骤流程
- **完整模块** - 特定领域的完整解决方案
- **三种代理类型** - 完整模块、混合或独立

**完美适用于：** 创建领域特定解决方案（法律、医疗、金融、教育、创意等）或使用自定义开发工作流程扩展BMM。

**文档：**

- **[BMB模块概述](./src/modules/bmb/README.md)** - 完整参考
- **[创建代理工作流程](./src/modules/bmb/workflows/create-agent/README.md)** - 构建自定义代理
- **[创建工作流程](./src/modules/bmb/workflows/create-workflow/README.md)** - 设计引导流程
- **[创建模块](./src/modules/bmb/workflows/create-module/README.md)** - 打包完整解决方案

### Creative Intelligence Suite(CIS) - 创新与创意

使用经过验证的方法论和技术进行AI驱动的创意促进。

**5个交互式工作流程：**

- **头脑风暴** - 使用30+技术生成和完善想法
- **设计思维** - 以人为中心的问题解决
- **问题解决** - 系统性突破技术
- **创新策略** - 颠覆性商业模式思维
- **叙事** - 引人入胜的叙事框架

**5个专业代理：** 每个都有独特的促进风格和领域专业知识

**共享资源：** CIS工作流程被其他模块使用（BMM的`brainstorm-project`使用CIS头脑风暴）

**文档：**

- **[CIS模块概述](./src/modules/cis/README.md)** - 完整参考
- **[CIS工作流程指南](./src/modules/cis/workflows/README.md)** - 所有5个创意工作流程

---

## 安装

**先决条件：** Node.js v20+（[下载](https://nodejs.org)）

```bash
# v6 Alpha（推荐新项目）
npx bmad-method@alpha install

# 稳定v4（生产环境）
npx bmad-method install
```

安装程序提供：

1. **模块选择** - 选择BMM、BMB、CIS（或全部）
2. **配置** - 您的姓名、语言偏好、游戏开发选项
3. **IDE集成** - 自动为您的IDE设置

**安装创建：**

```
your-project/
└── bmad/
    ├── core/         # 核心框架 + BMad主控代理
    ├── bmm/          # BMad方法（12个代理，34个工作流程）
    ├── bmb/          # BMad Builder（1个代理，7个工作流程）
    ├── cis/          # 创意智能（5个代理，5个工作流程）
    └── _cfg/         # 您的自定义（在更新中保持存在）
        └── agents/   # 代理自定义文件
```

**下一步：**

1. 在IDE中加载任意代理
2. 运行`*workflow-init`设置您的工作流程路径
3. 按照上面的[快速入门](#-快速入门)指南选择您的规划轨道

---

## 🎯 使用代理和命令

**多种执行工作流程的方式：**

BMad很灵活——您可以根据偏好和IDE以几种方式执行工作流程：

### 方法1：代理菜单（推荐初学者）

1. 在IDE中**加载代理**（见[IDE特定说明](./docs/ide-info/)）
2. **等待菜单**出现显示可用工作流程
3. **告知代理**要运行什么，使用自然语言或快捷方式：
   - 自然语言："运行workflow-init"
   - 快捷方式：`*workflow-init`
   - 菜单编号："运行选项2"

### 方法2：直接斜杠命令

**直接执行工作流程**使用斜杠命令：

```
/bmad:bmm:workflows:workflow-init
/bmad:bmm:workflows:prd
/bmad:bmm:workflows:dev-story
```

**提示：** 虽然您可以先不加载代理就运行这些，**仍然建议先加载代理** - 某些工作流程可能会有差异。

**优势：**

- ✅ 将任意代理与任意工作流程混合匹配
- ✅ 运行不在已加载代理菜单中的工作流程
- ✅ 知道命令名称的经验丰富的用户可以更快访问

### 方法3：派对模式执行

**运行多代理协作的工作流程：**

1. 启动派对模式：`/bmad:core:workflows:party-mode`
2. 执行任意工作流程——**整个团队协作完成**
3. 从多个专业代理获得不同视角

**完美适用于：** 战略决策、复杂工作流程、跨职能任务

---

> **📌 IDE特定注意：**
>
> 斜杠命令格式因IDE而异：
>
> - **Claude Code：** `/bmad:bmm:workflows:prd`
> - **Cursor/Windsurf：** 可能使用不同语法 - 检查您的IDE[文档](./docs/ide-info/)
> - **VS Code with Copilot Chat：** 语法可能不同
>
> 参见**[IDE集成指南](./docs/ide-info/)**了解您特定IDE的命令格式。

---

## 关键特性

### 🎨 更新安全的自定义

修改代理而不触及核心文件：

- 通过`bmad/_cfg/agents/`覆盖代理名称、个性、专业知识
- 自定义在所有更新中持续存在
- 多语言支持（交流 + 输出）
- 模块级别或全局配置

### 🚀 智能安装

适应您环境的智能设置：

- 自动检测v4安装以实现平滑升级
- 配置IDE集成（Claude Code、Cursor、Windsurf、VS Code）
- 解决跨模块依赖
- 生成统一的代理/工作流程清单

### 📁 清洁架构

所有内容都在一个地方：

- 单一`bmad/`文件夹（无分散文件）
- 模块并存（core、bmm、bmb、cis）
- 您的配置在`_cfg/`中（在更新中保持存在）
- 易于版本控制或排除

### 📄 文档分片（高级）

大型项目的可选优化（BMad方法和企业轨道）：

- **大幅节省令牌** - 阶段4工作流程仅加载所需部分（减少90%+）
- **自动支持** - 所有工作流程无缝处理完整或分片文档
- **简单设置** - 内置工具按标题分割文档
- **智能发现** - 工作流程自动检测格式

**[→ 文档分片指南](./docs/document-sharding-guide.md)**

---

## 文档

**模块文档：**

- **[BMM完整文档中心](./src/modules/bmm/docs/README.md)** - 所有BMM指南、常见问题、故障排除
- **[BMB模块参考](./src/modules/bmb/README.md)** - 构建自定义代理和工作流程
- **[CIS工作流程指南](./src/modules/cis/workflows/README.md)** - 创意促进工作流程

**其他资源：**

- **[文档索引](./docs/index.md)** - 所有项目文档
- **[v4到v6升级指南](./docs/v4-to-v6-upgrade.md)** - 迁移说明
- **[CLI工具指南](./tools/cli/README.md)** - 安装程序和构建工具参考
- **[贡献指南](./CONTRIBUTING.md)** - 如何贡献

---

## 社区与支持

- 💬 **[Discord社区](https://discord.gg/gk8jAdXWmj)** - 获取帮助、分享项目（#general-dev、#bugs-issues）
- 🐛 **[GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)** - 报告错误、请求功能
- 🎥 **[YouTube频道](https://www.youtube.com/@BMadCode)** - 视频教程和演示
- ⭐ **[Star此仓库](https://github.com/bmad-code-org/BMAD-METHOD)** - 保持版本更新

---

## 开发与质量检查

**适用于处理BMAD代码库的贡献者：**

**要求：** Node.js 22+（见`.nvmrc`）。运行`nvm use`切换到正确版本。

### 测试与验证

```bash
# 运行所有质量检查（全面 - 推送前使用）
npm test

# 个别测试套件
npm run test:schemas     # 代理模式验证（基于设备）
npm run test:install     # 安装组件测试（编译）
npm run validate:schemas # YAML模式验证
npm run validate:bundles # Web包完整性
```

### 代码质量

```bash
# 代码检查
npm run lint

# 自动修复代码检查问题
npm run lint:fix

# 格式检查
npm run format:check

# 自动格式化所有文件
npm run format:fix
```

### 构建与开发

```bash
# 为Web部署打包
npm run bundle

# 测试本地安装
npm run install:bmad
```

**预提交钩子：** 自动修复更改文件（lint-staged）+ 验证所有内容（npm test）
**CI：** GitHub Actions在每个PR上并行运行所有质量检查

---

## 贡献

我们欢迎贡献！参见**[CONTRIBUTING.md](CONTRIBUTING.md)**了解：

- 代码贡献指南
- 文档改进
- 模块开发
- 问题报告

---

## 许可证

**MIT许可证** - 详见[LICENSE](LICENSE)

**商标：** BMAD™和BMAD-METHOD™是BMad Code, LLC的商标。

---

[![贡献者](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

<sub>为人机协作社区用❤️构建</sub>
