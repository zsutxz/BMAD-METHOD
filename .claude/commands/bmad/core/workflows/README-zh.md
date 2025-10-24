# 核心工作流

## 核心中可用的工作流

**头脑风暴**

- 路径：`bmad/core/workflows/brainstorming/workflow.yaml`
- 使用多样化的创意技术促进互动式头脑风暴会议。此工作流使用多样化的创意技术促进互动式头脑风暴会议。会议具有高度互动性，AI作为引导者，指导用户通过各种构思方法来生成和完善创意解决方案。

**派对模式**

- 路径：`bmad/core/workflows/party-mode/workflow.yaml`
- 在所有已安装的BMAD代理之间协调群组讨论，实现自然的多代理对话

## 执行

运行任何工作流时：

1. 加载 {project-root}/bmad/core/tasks/workflow.xml
2. 将工作流路径作为 'workflow-config' 参数传递
3. 严格按照 workflow.xml 指令执行
4. 在每个部分之后保存输出

## 模式

- 正常模式：完整交互
- #yolo模式：跳过可选步骤