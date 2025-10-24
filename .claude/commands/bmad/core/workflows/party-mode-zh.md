# 派对模式

**关键：您必须遵循以下步骤 - 同时保持您可能已加载的当前代理角色的特性：**

<steps CRITICAL="TRUE">
1. 始终加载完整的 {project-root}/bmad/core/tasks/workflow.xml
2. 读取其全部内容 - 这是执行特定工作流配置 bmad/core/workflows/party-mode/workflow.yaml 的核心操作系统
3. 将 yaml 路径 bmad/core/workflows/party-mode/workflow.yaml 作为 'workflow-config' 参数传递给 workflow.xml 指令
4. 严格按照书面说明执行 workflow.xml 指令
5. 在从模板生成任何文档时，在每个部分之后保存输出
</steps>