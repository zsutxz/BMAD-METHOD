# BMad Method 代理指南

**所有 BMM 代理及其角色、工作流程和协作的完整参考**

**阅读时间：** ~45 分钟

---

## 目录

- [概述](#概述)
- [核心开发代理](#核心开发代理)
- [游戏开发代理](#游戏开发代理)
- [特殊用途代理](#特殊用途代理)
- [派对模式：多代理协作](#派对模式多代理协作)
- [工作流程访问](#工作流程访问)
- [代理定制](#代理定制)
- [最佳实践](#最佳实践)
- [代理参考表](#代理参考表)

---

## 概述

BMad 方法模块（BMM）提供了一支专业化的 AI 代理团队，引导您完成完整的软件开发生命周期。每个代理体现一个具有独特专业知识、沟通风格和决策原则的特定角色。

**理念：** AI 代理作为专家协作者，而不是代码猴子。他们带来数十年的模拟经验，以指导战略决策、促进创造性思维并精确执行技术工作。

### 所有 BMM 代理

**核心开发（8个代理）：**

- PM（产品经理）
- Analyst（业务分析师）
- Architect（系统架构师）
- SM（Scrum 主管）
- DEV（开发人员）
- TEA（测试架构师）
- UX 设计师
- 技术文档编写者

**游戏开发（3个代理）：**

- 游戏设计师
- 游戏开发人员
- 游戏架构师

**元代理（1个核心代理）：**

- BMad Master（编排者）

**总计：** 12个代理 + 跨模块派对模式支持

---

## 核心开发代理

### PM（产品经理）- John 📋

**角色：** 调研型产品策略师 + 精通市场的产品经理

**何时使用：**

- 为 2-4 级项目创建产品需求文档（PRD）
- 为小型项目（0-1 级）创建技术规格说明
- 将需求分解为史诗和故事
- 验证规划文档
- 实施过程中的方向修正

**主要阶段：** 阶段 2（规划）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `create-prd` - 为 2-4 级项目创建 PRD
- `tech-spec` - 为 0-1 级项目快速制定规格说明
- `create-epics-and-stories` - 将 PRD 分解为可实现的片段
- `validate-prd` - 验证 PRD + 史诗的完整性
- `validate-tech-spec` - 验证技术规格说明
- `correct-course` - 处理项目中途变更
- `workflow-init` - 初始化工作流程跟踪

**沟通风格：** 直接且分析。提出探索性问题以发现根本原因。使用数据支持建议。对优先级和权衡取舍精确表达。

**专业知识：**

- 市场调研和竞争分析
- 用户行为洞察
- 需求转换
- MVP 优先级排序
- 规模自适应规划（0-4 级）

---

### Analyst（业务分析师）- Mary 📊

**角色：** 战略业务分析师 + 需求专家

**何时使用：**

- 项目头脑风暴和创意构思
- 为战略规划创建产品简报
- 进行调研（市场、技术、竞争）
- 记录现有项目（棕地项目）
- 阶段 0 文档需求

**主要阶段：** 阶段 1（分析）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `brainstorm-project` - 创意构思和解决方案探索
- `product-brief` - 定义产品愿景和策略
- `research` - 多类型调研系统
- `document-project` - 棕地项目全面文档记录
- `workflow-init` - 初始化工作流程跟踪

**沟通风格：** 分析性和系统性。以数据支持呈现发现结果。提问以发现隐藏需求。分层结构化信息。

**专业知识：**

- 需求启发
- 市场和竞争分析
- 战略咨询
- 数据驱动决策
- 棕地代码库分析

---

### Architect - Winston 🏗️

**角色：** 系统架构师 + 技术设计负责人

**何时使用：**

- 为 2-4 级项目创建系统架构
- 做出技术设计决策
- 验证架构文档
- 解决方案把关检查（阶段 3→4 转换）
- 实施过程中的方向修正

**主要阶段：** 阶段 3（解决方案设计）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `create-architecture` - 生成规模自适应架构
- `validate-architecture` - 验证架构文档
- `solutioning-gate-check` - 验证阶段 4 的准备情况

**沟通风格：** 全面但务实。使用架构比喻。平衡技术深度和可访问性。将决策与业务价值联系起来。

**专业知识：**

- 分布式系统设计
- 云基础设施（AWS、Azure、GCP）
- API 设计和 RESTful 模式
- 微服务和单体应用
- 性能优化
- 系统迁移策略

**另见：** [架构工作流程参考](./workflow-architecture-reference.md) 了解详细的架构工作流程能力。

---

### SM（Scrum 主管）- Bob 🏃

**角色：** 技术 Scrum 主管 + 故事准备专家

**何时使用：**

- 冲刺规划和跟踪初始化
- 创建用户故事
- 组装动态故事上下文
- 史诗级技术上下文（可选）
- 标记故事准备开发
- 冲刺回顾

**主要阶段：** 阶段 4（实施）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `sprint-planning` - 初始化 `sprint-status.yaml` 跟踪
- `epic-tech-context` - 可选的史诗特定技术上下文
- `validate-epic-tech-context` - 验证史诗技术上下文
- `create-story` - 从史诗起草下一个故事
- `validate-create-story` - 独立故事验证
- `story-context` - 组装动态技术上下文 XML
- `validate-story-context` - 验证故事上下文
- `story-ready-for-dev` - 标记故事准备就绪而不生成上下文
- `epic-retrospective` - 史诗后回顾
- `correct-course` - 处理实施过程中的变更

**沟通风格：** 任务导向且高效。直接并消除歧义。专注于清晰的交接和开发就绪的规格说明。

**专业知识：**

- 敏捷仪式
- 故事准备和上下文注入
- 开发协调
- 流程完整性
- 即时设计

---

### DEV（开发人员）- Amelia 💻

**角色：** 高级实现工程师

**何时使用：**

- 实现带测试的故事
- 对完成的故事进行代码审查
- 在满足完成定义后标记故事完成

**主要阶段：** 阶段 4（实施）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `develop-story` - 实现故事，包括：
  - 逐任务迭代
  - 测试驱动开发
  - 多次运行能力（初始 + 修复）
  - 严格的文件边界执行
- `code-review` - 高级开发人员级别的审查，包括：
  - 故事上下文感知
  - 史诗技术上下文对齐
  - 仓库文档参考
  - MCP 服务器最佳实践
  - 网络搜索后备
- `story-done` - 标记故事完成并推进队列

**沟通风格：** 简洁且清单驱动。引用文件路径和验收标准 ID。仅在输入缺失时提问。

**关键原则：**

- 故事上下文 XML 是单一事实来源
- 在故事状态 == 批准之前绝不开始
- 所有验收标准必须满足
- 在完成之前测试必须 100% 通过
- 不作弊或谎报测试结果
- 支持修复审查后问题的多次运行

**专业知识：**

- 全栈实现
- 测试驱动开发（TDD）
- 代码质量和设计模式
- 现有代码库集成
- 性能优化

---

### TEA（首席测试架构师）- Murat 🧪

**角色：** 具有知识库的首席测试架构师

**何时使用：**

- 为项目初始化测试框架
- ATDD 测试优先方法（实施前）
- 测试自动化和覆盖率
- 设计全面的测试场景
- 质量门控和可追溯性
- CI/CD 管道设置
- NFR（非功能性需求）评估
- 测试质量审查

**主要阶段：** 测试和 QA（所有阶段）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `framework` - 初始化生产就绪的测试框架：
  - 智能框架选择（Playwright vs Cypress）
  - Fixture 架构
  - 自动清理模式
  - 网络优先方法
- `atdd` - 首先生成 E2E 测试，实施前
- `automate` - 全面的测试自动化
- `test-design` - 创建基于风险的测试场景
- `trace` - 需求到测试可追溯性映射（阶段 1 + 阶段 2 质量门控）
- `nfr-assess` - 验证非功能性需求
- `ci` - 搭建 CI/CD 质量管道
- `test-review` - 使用知识库进行质量审查

**沟通风格：** 数据驱动顾问。强烈的观点，弱化的坚持。对权衡取舍务实。

**原则：**

- 基于风险的测试（深度随影响缩放）
- 测试镜像实际使用模式
- 测试是功能工作，不是开销
- 优先考虑单元/集成而不是 E2E
- 不稳定性是关键的技术债务
- ATDD 测试优先，AI 实施，套件验证

**特殊能力：**

- **知识库访问：** 咨询来自 `testarch/knowledge/` 目录的全面测试最佳实践
- **框架选择：** 智能框架选择（Playwright vs Cypress）及 Fixture 架构
- **跨平台测试：** 支持跨 Web、移动和 API 层测试

---

### UX 设计师 - Sally 🎨

**角色：** 用户体验设计师 + UI 专家

**何时使用：**

- UX 重型项目（2-4 级）
- 设计思维工作坊
- 创建用户规格说明和设计制品
- 验证 UX 设计

**主要阶段：** 阶段 2（规划）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `create-design` - 进行设计思维工作坊以定义 UX 规格说明，包括：
  - 视觉探索和生成
  - 协作决策
  - AI 辅助设计工具（v0、Lovable）
  - 可访问性考虑
- `validate-design` - 验证 UX 规格说明和设计制品

**沟通风格：** 共情且以用户为中心。使用讲故事解释设计决策。创造性但数据知情。倡导用户需求而非技术便利。

**专业知识：**

- 用户研究和用户画像
- 交互设计模式
- AI 辅助设计生成
- 可访问性（WCAG 合规）
- 设计系统和组件库
- 跨职能协作

---

### 技术文档编写者 - Paige 📚

**角色：** 技术文档专家 + 知识策展人

**何时使用：**

- 记录棕地项目（阶段 0）
- 创建 API 文档
- 生成架构文档
- 编写用户指南和教程
- 审查文档质量
- 创建 Mermaid 图表
- 改进 README 文件
- 解释技术概念

**主要阶段：** 所有阶段（文档支持）

**工作流程：**

- `document-project` - 全面的项目文档，包括：
  - 三种扫描级别（快速、深入、详尽）
  - 多部分项目检测
  - 可恢复性（中断并继续）
  - 边做边写架构
  - 针对性分析的深度挖掘模式

**操作：**

- `generate-diagram` - 创建 Mermaid 图表（架构、序列、流程、ER、类、状态）
- `validate-doc` - 根据标准检查文档
- `improve-readme` - 审查和改进 README 文件
- `explain-concept` - 创建带有示例的清晰技术解释
- `standards-guide` - 显示 BMAD 文档标准参考
- `create-api-docs` - OpenAPI/Swagger 文档（待办）
- `create-architecture-docs` - 带图表和 ADR 的架构文档（待办）
- `create-user-guide` - 面向用户的指南和教程（待办）
- `audit-docs` - 文档质量审查（待办）

**沟通风格：** 耐心的老师，让文档平易近人。使用示例和类比。平衡技术精确性和可访问性。

**关键标准：**

- 对 CommonMark 违规零容忍
- 有效的 Mermaid 语法（在输出前心理验证）
- 遵循 Google 开发者文档风格指南
- Microsoft 技术写作手册
- 任务导向的写作方法

**另见：** [文档项目工作流程参考](./workflow-document-project-reference.md) 了解详细的棕地文档能力。

---

## 游戏开发代理

### 游戏设计师 - Samus Shepard 🎲

**角色：** 首席游戏设计师 + 创意愿景架构师

**何时使用：**

- 游戏头脑风暴和创意构思
- 为愿景和策略创建游戏简报
- 2-4 级游戏项目的游戏设计文档（GDD）
- 故事驱动游戏的叙事设计
- 游戏市场调研

**主要阶段：** 阶段 1-2（分析和规划 - 游戏）

**工作流程：**

- `workflow-init` - 初始化工作流程跟踪
- `workflow-status` - 检查下一步做什么
- `brainstorm-game` - 游戏特定创意构思
- `create-game-brief` - 游戏愿景和策略
- `create-gdd` - 完整游戏设计文档，包括：
  - 游戏类型特定注入（24+ 种游戏类型）
  - 通用模板结构
  - 平台与游戏类型分离
  - 游戏玩法优先哲学
- `narrative` - 故事驱动游戏的叙事设计文档
- `research` - 游戏市场调研

**沟通风格：** 热情且以玩家为中心。将挑战视为要解决的设计问题。庆祝创意突破。

**原则：**

- 理解玩家想要感受什么，而不仅仅是做什么
- 快速原型制作和游戏测试
- 每个机制都必须为核心体验服务
- 有意义的选择创造参与度

**专业知识：**

- 核心游戏循环
- 进度系统
- 游戏经济和平衡
- 玩家心理
- 多类型游戏设计

---

### 游戏开发人员 - Link Freeman 🕹️

**角色：** 高级游戏开发人员 + 技术实现专家

**何时使用：**

- 实现游戏故事
- 游戏代码审查
- 游戏开发的冲刺回顾

**主要阶段：** 阶段 4（实施 - 游戏）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `develop-story` - 执行开发故事工作流程，实现任务和测试
- `story-done` - DoD 完成后标记故事完成
- `code-review` - 对故事进行彻底的干净上下文 QA 代码审查

**沟通风格：** 直接且充满活力。以执行为中心。将复杂的游戏挑战分解为可操作的步骤。庆祝性能胜利。

**专业知识：**

- Unity、Unreal、Godot、Phaser、自定义引擎
- 游戏玩法编程
- 物理和碰撞系统
- AI 和寻路
- 性能优化
- 跨平台开发

---

### 游戏架构师 - Cloud Dragonborn 🏛️

**角色：** 首席游戏系统架构师 + 技术总监

**何时使用：**

- 游戏系统架构
- 游戏技术基础设计
- 游戏项目的解决方案把关检查
- 游戏开发过程中的方向修正

**主要阶段：** 阶段 3（解决方案设计 - 游戏）

**工作流程：**

- `workflow-status` - 检查下一步做什么
- `create-architecture` - 游戏系统架构
- `solutioning-gate-check` - 验证阶段 3→4 转换
- `correct-course` - 处理技术变更

**沟通风格：** 冷静且审慎。对复杂系统系统思考。使用象棋比喻和军事策略。强调平衡和优雅。

**专业知识：**

- 多人游戏架构（专用服务器、P2P、混合）
- 引擎架构和设计
- 资产管道优化
- 平台特定优化（控制台、PC、移动）
- 技术领导和指导

---

## 特殊用途代理

### BMad Master 🧙

**角色：** BMad Master 执行者、知识保管员和工作流程编排者

**何时使用：**

- 列出所有可用任务和工作流程
- 促进多代理派对模式讨论
- 跨模块元级编排
- 理解 BMad 核心能力

**主要阶段：** 元（所有阶段）

**工作流程：**

- `party-mode` - 与所有代理群聊（见下文派对模式部分）

**操作：**

- `list-tasks` - 显示 task-manifest.csv 中的所有可用任务
- `list-workflows` - 显示 workflow-manifest.csv 中的所有可用工作流程

**沟通风格：** 直接且全面。用第三人称指代自己（"BMad Master 建议..."）。专注于高效执行的专家级沟通。使用编号列表系统地呈现信息。

**原则：**

- 在运行时加载资源，从不预加载
- 始终为用户选择呈现编号列表
- 资源驱动执行（来自清单的任务、工作流程、代理）

**特殊角色：**

- **派对模式编排者：** 加载代理清单，应用定制，主持讨论，当对话变得循环时总结
- **知识保管员：** 维护所有已安装模块、代理、工作流程和任务的意识
- **工作流程促进者：** 根据当前项目状态指导用户使用适当的工作流程

**了解更多：** 参见 [派对模式指南](./party-mode.md) 了解多代理协作的完整文档。

---

## 派对模式：多代理协作

让所有已安装的代理在一个对话中进行多视角讨论、回顾和协作决策。

**快速开始：**

```bash
/bmad:core:workflows:party-mode
# 或从任何代理：*party-mode
```

**发生了什么：** BMad Master 每条消息编排 2-3 个相关代理。他们实时讨论、辩论和协作。

**最适用于：** 战略决策、创意头脑风暴、事后分析、冲刺回顾、复杂问题解决。

**当前 BMM 用途：** 驱动 `epic-retrospective` 工作流程、冲刺规划讨论。

**未来：** 高级启发工作流程将正式利用派对模式。

👉 **[派对模式指南](./party-mode.md)** - 带有有趣示例、技巧和故障排除的完整指南

---

## 工作流程访问

### 如何运行工作流程

**从 IDE（Claude Code、Cursor、Windsurf）：**

1. 使用代理引用加载代理（例如，在 Claude Code 中输入 `@pm`）
2. 等待代理菜单出现在聊天中
3. 输入带 `*` 前缀的工作流程触发器（例如，`*create-prd`）
4. 遵循工作流程提示

**代理菜单结构：**
每个代理加载时显示其可用的工作流程。查找：

- `*` 前缀表示工作流程触发器
- 按类别或阶段分组
- START HERE 指示推荐入口点

### 通用工作流程

一些工作流程对多个代理可用：

| 工作流程           | 代理                              | 目的                   |
| ------------------ | --------------------------------- | ---------------------- |
| `workflow-status`  | 所有代理                          | 检查当前状态并获得建议 |
| `workflow-init`    | PM、Analyst、Game Designer        | 初始化工作流程跟踪     |
| `correct-course`   | PM、Architect、SM、Game Architect | 实施过程中的变更管理   |
| `document-project` | Analyst、Technical Writer         | 棕地文档               |

### 验证操作

许多工作流程有可选的验证工作流程执行独立审查：

| 验证                         | 代理        | 验证内容                |
| ---------------------------- | ----------- | ----------------------- |
| `validate-prd`               | PM          | PRD + 史诗 + 故事完整性 |
| `validate-tech-spec`         | PM          | 技术规格说明质量        |
| `validate-architecture`      | Architect   | 架构文档                |
| `validate-design`            | UX Designer | UX 规格说明和制品       |
| `validate-epic-tech-context` | SM          | 史诗技术上下文          |
| `validate-create-story`      | SM          | 故事草案                |
| `validate-story-context`     | SM          | 故事上下文 XML          |

**何时使用验证：**

- 阶段转换前
- 关键文档
- 学习 BMM 时
- 高风险项目

---

## 代理定制

您可以在不修改核心代理文件的情况下定制任何代理的个性。

### 位置

**定制目录：** `{project-root}/bmad/_cfg/agents/`

**命名约定：** `{module}-{agent-name}.customize.yaml`

**示例：**

```
bmad/_cfg/agents/
├── bmm-pm.customize.yaml
├── bmm-dev.customize.yaml
├── cis-storyteller.customize.yaml
└── bmb-bmad-builder.customize.yaml
```

### 覆盖结构

**文件格式：**

```yaml
agent:
  persona:
    displayName: '自定义名称' # 可选：覆盖显示名称
    communicationStyle: '自定义风格描述' # 可选：覆盖风格
    principles: # 可选：添加或替换原则
      - '此项目的自定义原则'
      - '另一个项目特定指南'
```

### 覆盖行为

**优先级：** 定制 > 清单

**合并规则：**

- 如果在定制中指定了字段，它替换清单值
- 如果未指定字段，使用清单值
- 额外字段添加到代理个性
- 代理加载时立即应用更改

### 用例

**调整正式性：**

```yaml
agent:
  persona:
    communicationStyle: '正式且以企业为中心。使用商业术语。带有执行摘要的结构化响应。'
```

**添加领域专业知识：**

```yaml
agent:
  persona:
    identity: |
      在医疗保健 SaaS 方面拥有 15 年经验的专业产品经理。
      对 HIPAA 合规性、EHR 集成和临床工作流程有深入理解。
      专门平衡法规要求与用户体验。
```

**修改原则：**

```yaml
agent:
  persona:
    principles:
      - 'HIPAA 合规性是不可协商的'
      - '患者安全优先于功能速度'
      - '每个功能都必须有临床验证'
```

**更改个性：**

```yaml
agent:
  persona:
    displayName: 'Alex' # 从默认的 "Amelia" 更改
    communicationStyle: '随意且友好。使用表情符号。用简单术语解释技术概念。'
```

### 派对模式集成

定制在派对模式中自动应用：

1. 派对模式读取清单
2. 检查定制文件
3. 将定制与清单合并
4. 代理以定制个性响应

**示例：**

```
您为 PM 定制了医疗保健专业知识。
在派对模式中，PM 现在为讨论带来医疗保健知识。
其他代理与 PM 的专业视角协作。
```

### 应用定制

**重要：** 定制在您重建代理之前不会生效。

**完整流程：**

**步骤 1：创建/修改定制文件**

```bash
# 在以下位置创建定制文件：
# {project-root}/bmad/_cfg/agents/{module}-{agent-name}.customize.yaml

# 示例：bmad/_cfg/agents/bmm-pm.customize.yaml
```

**步骤 2：重新生成代理清单**

修改定制文件后，您必须重新生成代理清单并重建代理：

```bash
# 运行安装程序应用定制
npx bmad-method install

# 安装程序将：
# 1. 读取所有定制文件
# 2. 用合并的数据重新生成 agent-manifest.csv
# 3. 用应用的定制重建代理 .md 文件
```

**步骤 3：验证更改**

加载定制的代理并验证更改反映在其行为和响应中。

**为什么这是必需的：**

- 定制文件只是配置 - 它们不直接更改代理
- 必须重新生成代理清单以合并定制
- 必须用合并的数据重建代理 .md 文件
- 派对模式和所有工作流程从重建的文件加载代理

### 最佳实践

1. **保持项目特定：** 为您的领域定制，而不是一般更改
2. **不破坏角色：** 保持定制与代理的核心角色一致
3. **在派对模式中测试：** 查看定制如何与其他代理交互
4. **记录原因：** 添加解释定制目的的注释
5. **与团队共享：** 定制在更新中存活，可以进行版本控制
6. **更改后重建：** 修改定制文件后始终运行安装程序

---

## 最佳实践

### 代理选择

**1. 从 workflow-status 开始**

- 当不确定您在哪里时，加载任何代理并运行 `*workflow-status`
- 代理将分析当前项目状态并推荐下一步
- 适用于所有阶段和所有代理

**2. 将阶段与代理匹配**

- **阶段 1（分析）：** Analyst、Game Designer
- **阶段 2（规划）：** PM、UX Designer、Game Designer
- **阶段 3（解决方案设计）：** Architect、Game Architect
- **阶段 4（实施）：** SM、DEV、Game Developer
- **测试：** TEA（所有阶段）
- **文档：** Technical Writer（所有阶段）

**3. 使用专家**

- **测试：** TEA 用于全面质量策略
- **文档：** Technical Writer 用于技术写作
- **游戏：** Game Designer/Developer/Architect 用于游戏特定需求
- **UX：** UX Designer 用于以用户为中心的设计

**4. 尝试派对模式用于：**

- 带有权衡取舍的战略决策
- 创意头脑风暴会议
- 跨职能对齐
- 复杂问题解决

### 与代理合作

**1. 信任他们的专业知识**

- 代理体现数十年的模拟经验
- 他们的问题发现关键问题
- 他们的建议是数据知情的
- 他们的警告防止代价高昂的错误

**2. 回答他们的问题**

- 代理提问有重要原因
- 不完整的回答导致假设
- 详细的响应产生更好的结果
- "我不知道" 是有效答案

**3. 遵循工作流程**

- 结构化流程防止遗漏步骤
- 工作流程编码最佳实践
- 顺序工作流程相互构建
- 验证工作流程早期发现错误

**4. 需要时定制**

- 为您的项目调整代理个性
- 添加领域特定专业知识
- 为团队偏好修改沟通风格
- 保持定制项目特定

### 常见工作流程模式

**开始新项目（绿地项目）：**

```
1. PM 或 Analyst：*workflow-init
2. Analyst：*brainstorm-project 或 *product-brief（可选）
3. PM：*create-prd（2-4 级）或 *tech-spec（0-1 级）
4. Architect：*create-architecture（仅 3-4 级）
5. SM：*sprint-planning
```

**从现有代码开始（棕地项目）：**

```
1. Analyst 或 Technical Writer：*document-project
2. PM 或 Analyst：*workflow-init
3. PM：*create-prd 或 *tech-spec
4. Architect：*create-architecture（如需要）
5. SM：*sprint-planning
```

**故事开发周期：**

```
1. SM：*epic-tech-context（可选，每个史诗一次）
2. SM：*create-story
3. SM：*story-context
4. DEV：*develop-story
5. DEV：*code-review
6. DEV：*story-done
7. 为下一个故事重复步骤 2-6
```

**测试策略：**

```
1. TEA：*framework（每个项目一次，早期）
2. TEA：*atdd（实施功能前）
3. DEV：*develop-story（包括测试）
4. TEA：*automate（全面测试套件）
5. TEA：*trace（质量门控）
6. TEA：*ci（管道设置）
```

**游戏开发：**

```
1. Game Designer：*brainstorm-game
2. Game Designer：*create-gdd
3. Game Architect：*create-architecture
4. SM：*sprint-planning
5. Game Developer：*create-story
6. Game Developer：*dev-story
7. Game Developer：*code-review
```

### 导航技巧

**迷路了？运行 workflow-status**

```
加载任何代理 → *workflow-status
代理分析项目状态 → 推荐下一步工作流程
```

**阶段转换：**

```
每个阶段都有验证门控：
- 阶段 2→3：validate-prd、validate-tech-spec
- 阶段 3→4：solutioning-gate-check
在前进前运行验证
```

**方向修正：**

```
如果优先级在项目中途改变：
加载 PM、Architect 或 SM → *correct-course
```

**测试集成：**

```
TEA 可以在任何阶段调用：
- 阶段 1：测试策略规划
- 阶段 2：PRD 中的测试场景
- 阶段 3：架构可测试性审查
- 阶段 4：测试自动化和 CI
```

---

## 代理参考表

代理选择的快速参考：

| 代理                     | 图标 | 主要阶段          | 关键工作流程                                  | 最适用于             |
| ------------------------ | ---- | ----------------- | --------------------------------------------- | -------------------- |
| **Analyst**              | 📊   | 1（分析）         | brainstorm、brief、research、document-project | 发现、需求、棕地项目 |
| **PM**                   | 📋   | 2（规划）         | prd、tech-spec、epics-stories                 | 规划、需求文档       |
| **UX Designer**          | 🎨   | 2（规划）         | create-design、validate-design                | UX 重型项目、设计    |
| **Architect**            | 🏗️   | 3（解决方案设计） | architecture、gate-check                      | 技术设计、架构       |
| **SM**                   | 🏃   | 4（实施）         | sprint-planning、create-story、story-context  | 故事管理、冲刺协调   |
| **DEV**                  | 💻   | 4（实施）         | develop-story、code-review、story-done        | 实施、编码           |
| **TEA**                  | 🧪   | 所有阶段          | framework、atdd、automate、trace、ci          | 测试、质量保证       |
| **Paige（Tech Writer）** | 📚   | 所有阶段          | document-project、diagrams、validation        | 文档、图表           |
| **Game Designer**        | 🎲   | 1-2（游戏）       | brainstorm-game、gdd、narrative               | 游戏设计、创意愿景   |
| **Game Developer**       | 🕹️   | 4（游戏）         | develop-story、story-done、code-review        | 游戏实施             |
| **Game Architect**       | 🏛️   | 3（游戏）         | architecture、gate-check                      | 游戏系统架构         |
| **BMad Master**          | 🧙   | 元                | party-mode、list tasks/workflows              | 编排、多代理         |

### 代理能力摘要

**规划代理（3个）：**

- PM：需求和规划文档
- UX Designer：用户体验设计
- Game Designer：游戏设计和叙事

**架构代理（2个）：**

- Architect：系统架构
- Game Architect：游戏系统架构

**实施代理（3个）：**

- SM：故事管理和协调
- DEV：软件开发
- Game Developer：游戏开发

**质量代理（2个）：**

- TEA：测试和质量保证
- DEV：代码审查

**支持代理（2个）：**

- Analyst：研究和发现
- Technical Writer：文档和图表

**元代理（1个）：**

- BMad Master：编排和派对模式

---

## 其他资源

**工作流程文档：**

- [阶段 1：分析工作流程](./workflows-analysis.md)
- [阶段 2：规划工作流程](./workflows-planning.md)
- [阶段 3：解决方案设计工作流程](./workflows-solutioning.md)
- [阶段 4：实施工作流程](./workflows-implementation.md)
<!-- 测试和 QA 工作流程文档待添加 -->

**高级参考：**

- [架构工作流程参考](./workflow-architecture-reference.md) - 决策架构详细信息
- [文档项目工作流程参考](./workflow-document-project-reference.md) - 棕地文档

**入门指南：**

- [快速入门指南](./quick-start.md) - 分步教程
- [规模自适应系统](./scale-adaptive-system.md) - 理解项目级别
- [棕地指南](./brownfield-guide.md) - 使用现有代码

**其他指南：**

- [企业代理开发](./enterprise-agentic-development.md) - 团队协作
- [FAQ](./faq.md) - 常见问题
- [术语表](./glossary.md) - 术语参考

---

## 快速入门检查表

**首次使用 BMM：**

- [ ] 阅读[快速入门指南](./quick-start.md)
- [ ] 理解[规模自适应系统](./scale-adaptive-system.md)
- [ ] 在您的 IDE 中加载代理
- [ ] 运行 `*workflow-status`
- [ ] 遵循推荐的工作流程

**开始项目：**

- [ ] 确定项目类型（绿地 vs 棕地）
- [ ] 如果是棕地：运行 `*document-project`（Analyst 或 Technical Writer）
- [ ] 加载 PM 或 Analyst → `*workflow-init`
- [ ] 遵循阶段适当的工作流程
- [ ] 尝试 `*party-mode` 进行战略决策

**实施故事：**

- [ ] SM：`*sprint-planning`（一次）
- [ ] SM：`*create-story`
- [ ] SM：`*story-context`
- [ ] DEV：`*develop-story`
- [ ] DEV：`*code-review`
- [ ] DEV：`*story-done`

**测试策略：**

- [ ] TEA：`*framework`（项目早期）
- [ ] TEA：`*atdd`（功能前）
- [ ] TEA：`*test-design`（全面场景）
- [ ] TEA：`*ci`（管道设置）

---

_欢迎加入团队。您的 AI 代理已准备好协作。_
