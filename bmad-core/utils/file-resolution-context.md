# File Resolution Context

## IDE Activation Instructions for Agents

Add these two lines to any agent's `activation-instructions`:

```yaml
- IDE-FILE-RESOLUTION: Dependencies map to files as {root}/{type}/{name}.md where root=".bmad-core", type=folder (tasks/templates/checklists/utils), name=dependency name.
- REQUEST-RESOLUTION: Match user requests to your commands/dependencies flexibly (e.g., "draft story"→*create→create-next-story task), or ask for clarification if ambiguous.
```

## Quick Reference

| Dependency | File Path |
|------------|-----------|
| task: `create-next-story` | `.bmad-core/tasks/create-next-story.md` |
| template: `story-tmpl` | `.bmad-core/templates/story-tmpl.md` |
| checklist: `story-draft-checklist` | `.bmad-core/checklists/story-draft-checklist.md` |
| util: `template-format` | `.bmad-core/utils/template-format.md` |