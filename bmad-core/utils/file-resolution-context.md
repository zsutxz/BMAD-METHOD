# File Resolution Context for IDE Integration

This utility explains how BMAD agents should resolve file paths when working in IDE environments.

## Core Concepts

### Base Path Resolution

- The `root` field in each agent's YAML configuration defines the base path (typically `.bmad-core`)
- All file references in dependencies are relative to this root directory
- IDE agents must understand this structure to properly access files

### Dependency Path Patterns

All items under `dependencies` in agent configurations follow a consistent folder/file hierarchy:

| Dependency Type | Path Pattern | Example |
|----------------|--------------|---------|
| Tasks | `{root}/tasks/{task-name}.md` | `create-next-story` → `.bmad-core/tasks/create-next-story.md` |
| Templates | `{root}/templates/{template-name}.md` | `story-tmpl` → `.bmad-core/templates/story-tmpl.md` |
| Checklists | `{root}/checklists/{checklist-name}.md` | `story-draft-checklist` → `.bmad-core/checklists/story-draft-checklist.md` |
| Utils | `{root}/utils/{util-name}.md` | `template-format` → `.bmad-core/utils/template-format.md` |
| Data | `{root}/data/{data-name}.md` | `bmad-kb` → `.bmad-core/data/bmad-kb.md` |
| Agents | `{root}/agents/{agent-name}.md` | `sm` → `.bmad-core/agents/sm.md` |

### Natural Language to Command Mapping

Agents should understand various ways users might request actions:

#### Story Creation Examples

- "draft the next story" → `*draft` or `*create`
- "create a new story" → `*create`
- "prepare a story" → `*draft`
- All map to: `.bmad-core/tasks/create-next-story.md`

#### Checklist Examples

- "show story checklist" → `*checklist story-draft-checklist`
- "run the story checklist" → `*checklist story-draft-checklist`
- Maps to: `.bmad-core/checklists/story-draft-checklist.md`

#### Template Examples

- "use the story template" → Access `.bmad-core/templates/story-tmpl.md`
- "show prd template" → Access `.bmad-core/templates/prd-tmpl.md`

## Implementation Guidelines

### For IDE Agents

1. **Path Resolution**: Always construct full paths by combining:
   - Root directory from YAML configuration
   - Appropriate subfolder based on dependency type
   - Dependency name with `.md` extension

2. **File Access**: When executing tasks or using dependencies:
   - Resolve the full file path
   - Read the file content
   - Parse and execute instructions
   - Handle file-not-found errors gracefully

3. **Cross-References**: When one file references another:
   - Apply the same resolution rules
   - Maintain context of the current working directory

### For Task Execution

When a user requests task execution:

1. Parse the user's request to identify the task
2. Check command aliases (e.g., `create` and `draft` both map to `create-next-story`)
3. Resolve the task file path: `{root}/tasks/{task-name}.md`
4. Read and execute the task instructions
5. If the task references templates or other files, resolve those paths similarly

### Error Handling

- If a file doesn't exist at the resolved path, provide helpful feedback
- Suggest similar files if there might be a typo
- Never assume file locations outside the defined structure

## Integration Notes

- This resolution system ensures consistency across all agents
- IDE-specific tools can leverage this structure for autocomplete and navigation
- The pattern is extensible for new dependency types