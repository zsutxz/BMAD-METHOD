# /exit-persona

## Description

Returns Claude to default assistant mode, exiting any active IDE agent persona.

**Usage:** `/exit-agent`

## Behavior

- Immediately exits the current agent persona if one is active
- Returns to standard Claude Code assistant capabilities
- Clears any agent-specific context or workflows
- Confirms the exit to the user

## Example

```text
User: /exit-agent
Claude: Exited IDE agent mode. I'm now back to my standard Claude Code assistant capabilities.
```

## Related Commands

- `/ide-agent` - Switch to a specific IDE agent persona
