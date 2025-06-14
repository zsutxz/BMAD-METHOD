# Document Migration Task (V3 to V4)

## Purpose

Migrate BMAD-METHOD V3 documents to V4 format by aligning section headings, structure, and content organization with V4 templates while preserving all user-generated content.

## When to Use This Task

[[LLM: This task should be used after a V3 to V4 upgrade when the user has existing PRD and Architecture documents that need to be aligned with V4 templates. The task handles:

- PRD migration to V4 format
- Architecture migration (single backend or full-stack)
- Merging separate front-end and backend architecture docs into full-stack-architecture.md
  ]]

Use this task when:

- You've upgraded from BMAD V3 to V4
- Your documents have V3 section headings that differ from V4
- You have separate front-end and backend architecture documents
- You need to align your documents with V4 agent expectations

## Prerequisites

- Completed V3 to V4 upgrade
- Documents located in `docs/` folder
- Access to V4 templates in `.bmad-core/templates/`

## Process

### 1. Analyze Existing Documents

[[LLM: First, examine what documents exist in the docs/ folder:

- Look for prd.md or similar
- Look for architecture.md or similar
- Check for front-end-architecture.md or similar
- Note which documents need migration
  ]]

Identify which documents need migration:

- PRD document
- Architecture document(s)
- Any front-end specific architecture

### 2. PRD Migration

[[LLM: When migrating the PRD:

1. Read the existing PRD content
2. Compare with `.bmad-core/templates/prd-tmpl.md`
3. Map V3 sections to V4 sections:
   - Keep all user content
   - Update section headings to match V4
   - Add any missing V4 sections with placeholder content
   - Preserve any custom sections at the end

V3 → V4 Common Mappings:

- "Executive Summary" → "Goals and Background Context"
- "Goals" → "Goals and Background Context > Goals"
- "Requirements" → Keep as is
- "User Stories" → "Epics and User Stories"
  ]]

**PRD Section Mapping:**

1. Update main heading structure to match V4 template
2. Preserve all existing content under new headings
3. Add missing sections with appropriate prompts for completion
4. Maintain any project-specific custom sections

### 3. Architecture Migration

[[LLM: Determine architecture migration path:

1. If ONLY backend architecture exists:
   - Use `.bmad-core/templates/architecture-tmpl.md`
   - Map sections appropriately
2. If BOTH backend AND front-end architecture exist:
   - Use `.bmad-core/templates/full-stack-architecture-tmpl.md`
   - Merge content from both documents
   - Create unified architecture document
3. Section mapping approach:
   - Preserve all technical decisions and content
   - Update headings to match V4 structure
   - Combine overlapping sections intelligently
     ]]

**Architecture Migration Paths:**

#### Single Architecture → architecture.md

- Update section headings to V4 format
- Add any missing V4 sections
- Preserve all technical content

#### Multiple Architecture Files → full-stack-architecture.md

- Merge backend and front-end content
- Organize under V4 full-stack sections
- Eliminate redundancy while preserving all unique content
- Create unified system view

### 4. Content Preservation Rules

[[LLM: CRITICAL preservation rules:

1. NEVER delete user content
2. If unsure where content belongs, add it to the most relevant section
3. Preserve all:
   - Technical decisions
   - Diagrams and code blocks
   - Lists and tables
   - Custom sections
   - Links and references
4. Add [[LLM: migration note]] comments where manual review might be needed
   ]]

**Always Preserve:**

- All user-written content
- Technical specifications
- Diagrams (Mermaid, ASCII, etc.)
- Code examples
- Custom sections not in V4 template

### 5. Create Migration Report

[[LLM: After migration, create a brief report:

- List all documents migrated
- Note any sections that need manual review
- Highlight any content that was moved significantly
- Suggest next steps
  ]]

Generate `migration-report.md` with:

- Documents migrated
- Section mappings performed
- Any content requiring review
- Recommendations for manual updates

## Validation Checklist

Before completing migration:

- [ ] All original content is preserved
- [ ] Section headings match V4 templates
- [ ] No duplicate content in merged documents
- [ ] Documents are properly formatted
- [ ] Any uncertain mappings are marked for review

## Example Migrations

### V3 PRD Section → V4 PRD Section

```
V3: ## Executive Summary     → V4: ## Goals and Background Context
V3: ## Goals                 → V4: ### Goals
V3: ## Success Metrics       → V4: ## Success Metrics and KPIs
```

### Architecture Merge Example

```
backend-architecture.md + front-end-architecture.md → full-stack-architecture.md

V3 Backend: ## Technology Stack    →  V4: ## Technology Stack > ### Backend
V3 Frontend: ## UI Architecture    →  V4: ## Technology Stack > ### Frontend
```

## Post-Migration Steps

1. Review migrated documents for accuracy
2. Fill in any placeholder sections added
3. Run document sharding if needed
4. Update any cross-references between documents

## Important Notes

- This task requires careful analysis of existing content
- When in doubt, preserve content and mark for review
- The goal is structure alignment, not content rewriting
- Custom sections should be retained even if not in V4 template
- MOST CRITICAL - The ONLY LEVEL 2 HEADINGS should be what are in the V4 templates. so content preservation might mean making some content that was level 2 a level 3 now. UNDERSTAND that the LEVEL 2 headings result in file names
