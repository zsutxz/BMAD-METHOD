# Create Agent Utility

This utility helps you create a new BMAD agent for web platforms (Gemini, ChatGPT, etc.).

**Note for User-Created Agents**: If you're creating a custom agent for your own use (not part of the core BMAD system), prefix the agent ID with a period (e.g., `.data-analyst`) to ensure it's gitignored and won't conflict with repository updates.

## Process

Follow these steps to create a new agent:

### 1. Gather Basic Information

Ask the user for:

- **Agent ID**: A short, lowercase identifier (e.g., `data-analyst`, `security-expert`)
- **Agent Name**: The character name (e.g., "Elena", "Marcus")
- **Title**: Professional title (e.g., "Data Analyst", "Security Expert")
- **Description**: A brief description of the agent's role and primary focus

### 2. Define Personality and Expertise

Ask about:

- **Personality traits**: How should this agent behave? (professional, friendly, detail-oriented, etc.)
- **Communication style**: How do they speak? (formal, casual, technical, empathetic)
- **Expertise areas**: What are they exceptionally good at?
- **Years of experience**: How senior are they in their role?
- **Motivations**: What drives them to excel?

### 3. Identify Capabilities

Determine what the agent can do:

- **Existing tasks**: Which existing tasks from `/bmad-core/tasks/` should this agent know?
- **New tasks needed**: Does this agent need any specialized tasks that don't exist yet?
- **Templates used**: Which document templates will this agent work with?
- **Checklists**: Which quality checklists apply to this agent's work?

### 4. Create the Persona File

Create `/bmad-core/personas/{agent-id}.md` with this structure:
(For user-created agents, use `/bmad-core/personas/.{agent-id}.md`)

```markdown
# {Agent Name} - {Title}

## Character Profile

**Name:** {Agent Name}
**Title:** {Title}
**Experience:** {Years} years in {field}

## Personality

{Describe personality traits, communication style, and approach to work}

## Core Expertise

{List main areas of expertise and specialization}

## Responsibilities

{List key responsibilities in bullet points}

## Working Style

{Describe how they approach problems, collaborate, and deliver results}

## Motivations

{What drives them to excel in their role}

## Catchphrases

{Optional: Any signature phrases or ways of speaking}
```

### 5. Create the Agent Configuration

Create `/agents/{agent-id}.yml` with this structure:
(For user-created agents, use `/agents/.{agent-id}.yml`)

```yaml
agent:
  id: {agent-id}
  name: {Agent Name}
  title: {Title}
  description: >-
    {Full description of the agent's role and value}
  persona: {agent-id}
  customize: >-
    {Any specific behavioral customizations}

dependencies:
  tasks:
    - {list of task IDs}
  templates:
    - {list of template IDs}
  checklists:
    - {list of checklist IDs}
  data:
    - {list of data file IDs}
  utils:
    - template-format
```

### 6. Create Any New Tasks

If new tasks were identified, create them in `/bmad-core/tasks/{task-name}.md`
(For user-created tasks, use `/bmad-core/tasks/.{task-name}.md`)

### 7. Test and Validate

1. Run `npm run validate` to check configuration
2. Run `npm run build:agent -a {agent-id}` to build the agent
3. Review the generated output in `/dist/agents/{agent-id}.txt`

## Example Questions to Ask

1. "What will this agent be called? (ID like 'data-analyst')"
2. "What's their character name? (like 'Elena')"
3. "What's their professional title?"
4. "Describe their main role in 2-3 sentences."
5. "What personality traits should they have?"
6. "How many years of experience do they have?"
7. "What existing tasks should they know? (e.g., create-doc-from-template, execute-checklist)"
8. "Do they need any specialized tasks that don't exist yet?"
9. "Which document templates will they use?"
10. "What motivates them in their work?"

## Important Notes

- Keep personas engaging but professional
- Ensure all referenced tasks, templates, and checklists exist
- Web agents can be more detailed than IDE agents (no size constraints)
- Consider how this agent will collaborate with existing team members
- Run validation after creating to catch any issues
