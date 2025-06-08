# Create Expansion Pack Utility

This utility helps you create a comprehensive BMAD expansion pack that can include new agents, tasks, templates, and checklists for a specific domain.

## Understanding Expansion Packs

Expansion packs extend BMAD with domain-specific capabilities. They are self-contained packages that can be installed into any BMAD project.

## Process Overview

### Phase 1: Discovery and Planning

#### 1.1 Define the Domain

Ask the user:

- **Pack Name**: Short identifier (e.g., `healthcare`, `fintech`, `gamedev`)
- **Display Name**: Full name (e.g., "Healthcare Compliance Pack")
- **Description**: What domain or industry does this serve?
- **Key Problems**: What specific challenges will this pack solve?
- **Target Users**: Who will benefit from this expansion?

#### 1.2 Gather Examples

Request from the user:

- **Sample Documents**: Any existing documents in this domain
- **Workflow Examples**: How work currently flows in this domain
- **Compliance Needs**: Any regulatory or standards requirements
- **Output Examples**: What final deliverables look like

### Phase 2: Component Design

#### 2.1 Identify Required Agents

For each proposed agent:

- **Role**: What specialist is needed?
- **Expertise**: Domain-specific knowledge required
- **Interactions**: How they work with existing BMAD agents
- **Unique Value**: What can't existing agents handle?

#### 2.2 Design Specialized Tasks

For each task:

- **Purpose**: What specific action does it enable?
- **Inputs**: What information is needed?
- **Process**: Step-by-step instructions
- **Outputs**: What gets produced?
- **Agent Usage**: Which agents will use this task?

#### 2.3 Create Document Templates

For each template:

- **Document Type**: What kind of document?
- **Structure**: Sections and organization
- **Placeholders**: Variable content areas
- **Instructions**: How to complete each section
- **Standards**: Any format requirements

#### 2.4 Define Checklists

For each checklist:

- **Purpose**: What quality aspect does it verify?
- **Scope**: When should it be used?
- **Items**: Specific things to check
- **Criteria**: Pass/fail conditions

### Phase 3: Implementation

#### 3.1 Create Directory Structure

```
expansion-packs/
└── {pack-name}/
    ├── manifest.yml
    ├── README.md
    ├── agents/
    │   └── {agent-id}.yml
    ├── personas/
    │   └── {agent-id}.md
    ├── tasks/
    │   └── {task-name}.md
    ├── templates/
    │   └── {template-name}.md
    ├── checklists/
    │   └── {checklist-name}.md
    └── ide-agents/
        └── {agent-id}.ide.md
```

#### 3.2 Create Manifest

Create `manifest.yml`:

```yaml
name: {Pack Name}
version: 1.0.0
description: >-
  {Detailed description of the expansion pack}
author: {Your name or organization}
bmad_version: "4.0.0"

# Files to install
files:
  - source: agents/{agent-id}.yml
    destination: agents/{agent-id}.yml
  - source: personas/{agent-id}.md
    destination: bmad-core/personas/{agent-id}.md
  - source: tasks/{task-name}.md
    destination: bmad-core/tasks/{task-name}.md
  # ... more files

# Optional: Update existing teams
team_updates:
  - team: team-technical.yml
    add_agent: {new-agent-id}

# Post-install message
post_install_message: >-
  {Pack Name} installed successfully!
  
  New agents available: {list agents}
  New tasks available: {list tasks}
  
  Run 'npm run build' to generate bundles.
```

### Phase 4: Content Creation

#### 4.1 Agent Creation Checklist

For each new agent:

1. Create persona file with domain expertise
2. Create agent configuration YAML
3. Create IDE-optimized version (optional)
4. List all task dependencies
5. Define template usage
6. Add to relevant teams

#### 4.2 Task Creation Guidelines

Each task should:

1. Have a clear, single purpose
2. Include step-by-step instructions
3. Provide examples when helpful
4. Reference domain standards
5. Be reusable across agents

#### 4.3 Template Best Practices

Templates should:

1. Include clear section headers
2. Provide inline instructions
3. Show example content
4. Mark required vs optional sections
5. Include domain-specific terminology

### Phase 5: Testing and Documentation

#### 5.1 Create README

Include:

- Overview of the pack's purpose
- List of all components
- Installation instructions
- Usage examples
- Integration notes

#### 5.2 Test Installation

1. Run `node tools/install-expansion-pack.js {pack-name}`
2. Verify all files copied correctly
3. Build agents to test configurations
4. Run sample scenarios

## Example: Healthcare Expansion Pack

```
healthcare/
├── manifest.yml
├── README.md
├── agents/
│   ├── clinical-analyst.yml
│   └── compliance-officer.yml
├── personas/
│   ├── clinical-analyst.md
│   └── compliance-officer.md
├── tasks/
│   ├── hipaa-assessment.md
│   ├── clinical-protocol-review.md
│   └── patient-data-analysis.md
├── templates/
│   ├── clinical-trial-protocol.md
│   ├── hipaa-compliance-report.md
│   └── patient-outcome-report.md
└── checklists/
    ├── hipaa-checklist.md
    └── clinical-data-quality.md
```

## Interactive Questions Flow

### Initial Discovery
1. "What domain or industry will this expansion pack serve?"
2. "What are the main challenges or workflows in this domain?"
3. "Do you have any example documents or outputs? (Please share)"
4. "What specialized roles/experts exist in this domain?"

### Agent Planning
5. "For agent '{name}', what is their specific expertise?"
6. "What unique tasks would this agent perform?"
7. "How would they interact with existing BMAD agents?"

### Task Design
8. "Describe the '{task}' process step-by-step"
9. "What information is needed to complete this task?"
10. "What should the output look like?"

### Template Creation
11. "What sections should the '{template}' document have?"
12. "Are there any required formats or standards?"
13. "Can you provide an example of a completed document?"

### Integration
14. "Which existing teams should include these new agents?"
15. "Are there any dependencies between components?"

## Important Considerations

- **Domain Expertise**: Ensure accuracy in specialized fields
- **Compliance**: Include necessary regulatory requirements
- **Compatibility**: Test with existing BMAD agents
- **Documentation**: Provide clear usage instructions
- **Examples**: Include real-world scenarios
- **Maintenance**: Plan for updates as domain evolves

## Tips for Success

1. **Start Small**: Begin with 1-2 agents and expand
2. **Get Examples**: Real documents make better templates
3. **Test Thoroughly**: Run complete workflows
4. **Document Well**: Others will need to understand the domain
5. **Iterate**: Refine based on usage feedback