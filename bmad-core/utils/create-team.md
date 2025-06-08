# Create Team Utility

This utility helps you create a new BMAD team bundle by combining existing agents.

## Process

### 1. Define Team Basics

Ask the user for:

- **Team ID**: Filename without extension (e.g., `team-frontend`, `team-planning`)
- **Team Name**: Display name (e.g., "Frontend Development Team")
- **Team Description**: What this team is designed to accomplish
- **Target Environment**: Usually "web" for team bundles

### 2. List Available Agents

Show all available agents from `/agents/`:

```
Available agents:
- analyst (Mary) - Project Analyst and Brainstorming Coach
- architect (Fred) - System Architecture Expert
- bmad (BMad) - BMAD Method Orchestrator
- ui-architect (Jane) - UI/UX Architecture Expert
- dev (James) - Full Stack Developer
- devops (Alex) - Platform Engineer
- fullstack-architect (Winston) - Holistic System Designer
- pm (John) - Product Manager
- po (Sarah) - Product Owner
- qa (Quinn) - Test Architect
- sm (Bob) - Scrum Master
- ux-expert (Sally) - UX Design Expert
```

### 3. Select Team Members

For each agent the user wants to include:

1. Confirm the agent ID
2. Ask if they want to customize the persona for this team context
3. Note any special team dynamics or relationships

### 4. Optimize Team Composition

Consider:

- **Role coverage**: Does the team have all necessary skills?
- **Team size**: 3-7 agents is usually optimal
- **Collaboration**: How will these agents work together?
- **Use cases**: What problems will this team solve?

### 5. Create Team Configuration

Create `/agent-teams/{team-id}.yml`:

```yaml
bundle:
  name: {Team Name}
  description: >-
    {Detailed description of the team's purpose and capabilities}
  target_environment: web
  
agents:
  - {agent-id-1}
  - {agent-id-2}
  - {agent-id-3}
  # ... more agents
```

#### Using Wildcards

You can use `"*"` (quoted) to include all available agents:

```yaml
agents:
  - bmad         # Always include bmad first
  - "*"          # Include all other agents
```

Or mix specific agents with wildcard:

```yaml
agents:
  - pm           # Product Manager first
  - architect    # Then Architect
  - "*"          # Then all remaining agents
```

### 6. Validate and Build

1. Run `npm run validate` to check configuration
2. Run `npm run build` to generate the team bundle
3. Review output in `/dist/teams/{team-filename}.txt`

## Example Teams

### Development Team
```yaml
bundle:
  name: Development Team Bundle
  description: >-
    Core development team for building features from story to deployment
  target_environment: web

agents:
  - sm      # Sprint coordination
  - dev     # Implementation
  - qa      # Quality assurance
  - devops  # Deployment
```

### Planning Team
```yaml
bundle:
  name: Planning Team Bundle
  description: >-
    Strategic planning team for project inception and architecture
  target_environment: web

agents:
  - analyst    # Requirements gathering
  - pm         # Product planning
  - architect  # System design
  - po         # Validation
```

### Full-Stack Team
```yaml
bundle:
  name: Full-Stack Team Bundle
  description: >-
    Complete team for full-stack application development
  target_environment: web

agents:
  - fullstack-architect  # Holistic design
  - design-architect     # Frontend architecture
  - dev                  # Implementation
  - qa                   # Testing
  - devops              # Infrastructure
```

## Questions to Ask

1. "What should this team be called? (e.g., 'team-mobile')"
2. "What's the team's display name?"
3. "Describe the team's primary purpose"
4. "Which agents should be on this team? (list agent IDs)"
5. "Any special dynamics between team members?"
6. "What types of projects will this team handle?"

## Tips for Good Teams

- **Start small**: Begin with 3-4 core agents
- **Clear purpose**: Each team should have a specific focus
- **Complementary skills**: Agents should cover different aspects
- **Avoid redundancy**: Don't include agents with overlapping roles
- **Consider workflow**: Order agents by typical workflow sequence

## Common Team Patterns

1. **Scrum Team**: sm, dev, qa, po
2. **Planning Team**: analyst, pm, architect, po
3. **Design Team**: ux-expert, ui-architect, dev
4. **Full Organization**: All agents (for complex projects)
5. **Technical Team**: architect, dev, devops, qa

## Important Notes

- Teams reference existing agents - create agents first
- Keep team descriptions clear and purpose-driven
- Consider creating multiple focused teams rather than one large team
- Test team dynamics by running sample scenarios