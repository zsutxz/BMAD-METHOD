# 冲刺规划工作流

## 概述

sprint-planning工作流生成和管理作为阶段4实施单一事实来源的冲刺状态跟踪文件。它从史诗文件中提取所有史诗和故事，并跟踪它们在开发生命周期中的进展。

在敏捷术语中，此工作流促进**冲刺规划**或**Sprint 0启动** - 从规划/架构到实际开发执行的过渡。

## 目的

此工作流创建一个`sprint-status.yaml`文件，该文件：

- 按顺序列出所有史诗、故事和回顾
- 跟踪每个项目的当前状态
- 提供接下来需要做什么的清晰视图
- 确保一次只有一个故事在进行中
- 维护从待办事项到完成的开发流程

## 何时使用

在以下情况下运行此工作流：

1. **初始时** - 在阶段3（解决方案）完成且史诗最终确定后
2. **史诗上下文创建后** - 将史诗状态更新为'contexted'
3. **定期** - 自动检测新创建的故事文件
4. **状态检查** - 查看整体项目进展

## 状态状态机

### 史诗流程

```
backlog → contexted
```

### 故事流程

```
backlog → drafted → ready-for-dev → in-progress → review → done
```

### 回顾流程

```
optional ↔ completed
```

## 关键指南

1. **推荐史诗上下文**：史诗应该在其故事可以被`drafted`之前进行`contexted`
2. **灵活并行**：基于团队容量，多个故事可以`in-progress`
3. **顺序默认**：史诗内的故事通常按顺序工作，但支持并行工作
4. **审查流程**：故事在`done`之前应该经过`review`
5. **学习转移**：SM通常在前一个故事`done`后起草下一个故事，融入学习成果

## 文件位置

### 输入文件

- **史诗文件**：`{output_folder}/epic*.md` 或 `{output_folder}/epics.md`
- **史诗上下文**：`{output_folder}/epic-{n}-context.md`
- **故事文件**：`{story_dir}/{epic}-{story}-{title}.md`
  - 示例：`stories/1-1-user-authentication.md`
- **故事上下文**：`{story_dir}/{epic}-{story}-{title}-context.md`
  - 示例：`stories/1-1-user-authentication-context.md`

### 输出文件

- **状态文件**：`{output_folder}/sprint-status.yaml`

## 代理使用方式

### SM（Scrum主管）代理

```yaml
任务:
  - 检查sprint-status.yaml中状态为'done'的故事
  - 识别下一个要起草的'backlog'故事
  - 运行create-story工作流
  - 更新状态为'drafted'
  - 创建故事上下文
  - 更新状态为'ready-for-dev'
```

### 开发者代理

```yaml
任务:
  - 查找状态为'ready-for-dev'的故事
  - 开始时更新为'in-progress'
  - 实施故事
  - 完成时更新为'review'
  - 处理审查反馈
  - 审查后更新为'done'
```

### 测试架构师

```yaml
任务:
  - 监控进入'review'的故事
  - 跟踪史诗进展
  - 识别何时需要回顾
```

## 示例输出

```yaml
# 冲刺状态
# 生成时间：2025-01-20
# 项目：MyPlantFamily

development_status:
  epic-1: contexted
  1-1-project-foundation: done
  1-2-app-shell: done
  1-3-user-authentication: in-progress
  1-4-plant-data-model: ready-for-dev
  1-5-add-plant-manual: drafted
  1-6-photo-identification: backlog
  epic-1-retrospective: optional

  epic-2: contexted
  2-1-personality-system: in-progress
  2-2-chat-interface: drafted
  2-3-llm-integration: backlog
  2-4-reminder-system: backlog
  epic-2-retrospective: optional
```

## 与BMM工作流的集成

此工作流是阶段4（实施）的一部分，并与以下内容集成：

1. **epic-tech-context** - 为史诗创建技术上下文
2. **create-story** - 起草单个故事文件
3. **story-context** - 为故事添加实施上下文
4. **dev-story** - 开发人员实施故事
5. **review-story** - SM审查实施
6. **retrospective** - 可选史诗回顾

## 优势

- **清晰可见性**：每个人都知道正在进行什么工作
- **灵活容量**：支持顺序和并行工作模式
- **学习转移**：SM可以在起草下一个故事时融入学习成果
- **进展跟踪**：易于查看整体项目状态
- **自动化友好**：简单的YAML格式供代理更新

## 提示

1. **初始生成**：在史诗最终确定后立即运行
2. **定期更新**：代理应该在工作时更新状态
3. **手动覆盖**：如果需要，您可以手动编辑文件
4. **首先备份**：工作流在重新生成前备份现有状态
5. **验证**：工作流验证合法的状态转换