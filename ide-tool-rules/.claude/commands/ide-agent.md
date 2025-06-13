# /ide-agent

## Description

Switches Claude to embody a specific IDE agent persona from the BMAD-METHOD framework.

**Usage:** `/ide-agent <agent-name>` or `/ide-agent` (to list available agents)

**Instructions:**

IMPORTANT: When an agent name is provided (e.g., `/ide-agent pm`):

1. IMMEDIATELY read the file at `bmad-core/ide-agents/{agent-name}.ide.md`
2. DO NOT search for related files or use the Task tool
3. Start operating as that agent persona right away

For complete behavior details, see `bmad-core/utils/agent-switcher.ide.md`.

## Related Commands

### /exit-agent

Returns Claude to default assistant mode, exiting any active IDE agent persona.

**Usage:** `/exit-agent` or `/exit`
