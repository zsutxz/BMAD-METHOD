# Create Agent Task

This task guides you through creating a new BMAD agent that conforms to the agent schema and integrates with existing teams and workflows.

**Note for User-Created Agents**: If creating a custom agent for your own use (not part of the core BMAD system), prefix the agent ID with a period (e.g., `.data-analyst`) to ensure it's gitignored and won't conflict with repository updates.

## Prerequisites

1. Load and understand the agent schema: `/bmad-core/schemas/agent-schema.yml`
2. Review existing agents in `/agents/` to understand naming patterns
3. Check existing teams in `/bmad-core/agent-teams/` for integration opportunities
4. Review workflows in `/bmad-core/workflows/` to understand where the agent might fit

## Process

### 1. Gather Core Agent Information

Based on the agent schema's required fields, collect:

- **Agent ID**: Following the schema pattern `^[a-z][a-z0-9-]*$` (e.g., `data-analyst`, `security-expert`)
  - For user agents: prefix with period (`.data-analyst`)
- **Character Name**: Following pattern `^[A-Z][a-z]+$` (e.g., "Elena", "Marcus")
- **Professional Title**: 5-50 characters (e.g., "Data Analyst", "Security Expert")
- **Description**: 20-300 characters describing the agent's main goal and purpose

### 2. Define Personality and Expertise

Create a comprehensive persona by exploring:

- **Identity**: Extended description of specialization (20+ characters)
- **Focus**: Primary objectives and responsibilities (20+ characters)
- **Style**: Communication and approach characteristics (20+ characters)
- **Core Principles**: At least 3 principles including the required "Numbered Options Protocol"
- **Experience Level**: Years in field and depth of expertise
- **Working Approach**: How they solve problems and deliver value

### 3. Identify Dependencies

Analyze what resources the agent needs:

#### Tasks (from `/bmad-core/tasks/`)
- Review available tasks and identify which apply
- Common tasks most agents need:
  - `advanced-elicitation` (for conversational depth)
  - `create-doc-from-template` (if they create documents)
  - `execute-checklist` (if they validate work)
- Identify any new specialized tasks needed

#### Templates (from `/bmad-core/templates/`)
- Which document templates will this agent create/use?
- Match template pattern: `^[a-z][a-z0-9-]*-tmpl$`

#### Checklists (from `/bmad-core/checklists/`)
- Which quality checklists apply to their work?
- Match checklist pattern: `^[a-z][a-z0-9-]*-checklist$`

#### Data Files (from `/bmad-core/data/`)
- `bmad-kb` (if they need BMAD methodology knowledge)
- `technical-preferences` (if they make technical decisions)
- Other specialized data files

### 4. Create the Persona File

Create `/bmad-core/personas/{agent-id}.md` following the schema-required structure:
(For user agents: `/bmad-core/personas/.{agent-id}.md`)

```markdown
# Role: {Title} Agent

## Persona

- Role: {Descriptive Role Statement}
- Style: {Communication style and approach}

## Core {Title} Principles (Always Active)

- **{Principle Name}:** {Detailed explanation}
- **{Principle Name}:** {Detailed explanation}
- **Numbered Options Protocol:** When presenting multiple options, always use numbered lists for easy selection
[Add more principles as needed]

## Critical Start Up Operating Instructions

- Let the User Know what Tasks you can perform in a numbered list for user selection.
- Execute the Full Tasks as Selected. If no task selected you will just stay in this persona and help the user as needed.
- When conversing with the user and providing advice or multiple options, always present them as numbered lists for easy selection. When appropriate, also offer `advanced-elicitation` options during conversations.

[Add any agent-specific sections like Expertise, Workflow, etc.]
```

### 5. Create the Agent Configuration

Create `/agents/{agent-id}.yml` conforming to the schema:
(For user agents: `/agents/.{agent-id}.yml`)

```yaml
agent:
  name: {Character Name}
  id: {agent-id}
  title: {Professional Title}
  description: {20-300 character description}
  persona: bmad-core/personas/{agent-id}.md
  customize: "" # or specific customizations

dependencies:
  tasks:
    - {task-id} # from identified tasks
  templates:
    - {template-id} # from identified templates
  checklists:
    - {checklist-id} # from identified checklists
  data:
    - {data-id} # from identified data files
  utils:
    - {util-id} # typically empty or specific utils
```

### 6. Team Integration Analysis

Review existing teams and suggest integration:

1. **Load team configurations** from `/bmad-core/agent-teams/`
2. **Analyze fit** based on:
   - Agent's role and expertise
   - Team's description and purpose
   - Existing agents in the team
   - Workflows the team supports

3. **Suggest teams** where this agent would add value:
   - For technical agents → suggest technical teams
   - For UX/design agents → suggest teams with UI workflows
   - For planning agents → suggest all teams

4. **Offer to update** team configurations:
   ```yaml
   agents:
     - bmad
     - {existing-agents}
     - {new-agent-id} # Add here
   ```

### 7. Workflow Integration Analysis

Review workflows and suggest where the agent fits:

1. **Load workflow definitions** from `/bmad-core/workflows/`
2. **Analyze workflow stages** to identify where this agent would contribute
3. **Suggest integration points**:
   - Planning phases → analysts, PMs
   - Design phases → UX experts, architects
   - Implementation phases → developers
   - Validation phases → QA, PO

4. **Document recommendations** for workflow updates if needed

### 8. Create IDE Agent (Optional)

If the agent should also work in IDE environments:

1. Create `/bmad-core/ide-agents/{agent-id}.ide.md`
2. Follow the IDE agent schema from `/bmad-core/schemas/ide-agent-schema.yml`
3. Include required commands (*help, *chat-mode) and startup instructions

### 9. Validation and Testing

1. **Validate against schema**: Ensure configuration matches agent-schema.yml
2. **Run build validation**: `npm run validate`
3. **Build the agent**: `npm run build:agent -a {agent-id}`
4. **Test in teams**: Build teams that include this agent
5. **Review output**: Check `/dist/agents/{agent-id}.txt`

## Integration Checklist

After creating the agent, verify:

- [ ] Agent configuration validates against schema
- [ ] Persona file includes all required sections
- [ ] All referenced dependencies exist
- [ ] Team integration suggestions documented
- [ ] Workflow integration points identified
- [ ] Build completes without errors
- [ ] Agent output is under size limits (if applicable)

## Example Integration Analysis

When creating a "Security Expert" agent:

**Team Integration:**
- `team-fullstack`: Add for security reviews in full-stack projects
- `team-no-ui`: Add for backend service security assessments

**Workflow Integration:**
- `greenfield-*`: Security review after architecture phase
- `brownfield-*`: Security assessment before implementation

This ensures the new agent enhances existing capabilities rather than working in isolation.
