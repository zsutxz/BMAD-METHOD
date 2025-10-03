# Build Agent - Interactive Agent Builder Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.md</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/bmb/workflows/create-agent/workflow.yaml</critical>
<critical>Study YAML agent examples in: {project_root}/bmad/bmm/agents/ for patterns</critical>

<workflow>

<step n="-1" goal="Optional brainstorming for agent ideas" optional="true">
<action>Ask the user: "Do you want to brainstorm agent ideas first? [y/n]"</action>

If yes:
<action>Invoke brainstorming workflow: {project-root}/bmad/cis/workflows/brainstorming/workflow.yaml</action>
<action>Pass context data: {installed_path}/brainstorm-context.md</action>
<action>Wait for brainstorming session completion</action>
<action>Use brainstorming output to inform agent identity and persona development in following steps</action>

If no, proceed directly to Step 0.

<template-output>brainstorming_results</template-output>
</step>

<step n="0" goal="Load technical documentation">
<critical>Load and understand the agent building documentation</critical>
<action>Load agent architecture reference: {agent_architecture}</action>
<action>Load agent types guide: {agent_types}</action>
<action>Load command patterns: {agent_commands}</action>
<action>Understand the YAML agent schema and how it compiles to final .md via the installer</action>
<action>Understand the differences between Simple, Expert, and Module agents</action>
</step>

<step n="1" goal="Choose agent type and gather basic identity">
<action>If brainstorming was completed in Step -1, reference those results to guide agent type and identity decisions</action>

Ask the user about their agent:

**What type of agent do you want to create?**

1. **Simple Agent** - Self-contained, standalone agent with embedded capabilities in a single file
2. **Expert Agent** - Specialized agent with sidecar files/folders for domain expertise and task files
3. **Module Agent** - Full-featured agent belonging to a module with external tasks, workflows and resources

Based on their choice, gather:

- Agent filename (kebab-case, e.g., "data-analyst", "diary-keeper")
- Agent name (e.g., "Sarah", "Max", or descriptive like "Data Wizard")
- Agent title (e.g., "Data Analyst", "Personal Assistant")
- Agent icon (single emoji, e.g., "📊", "🤖", "🧙")

For Module agents also ask:

- Which module? (bmm, bmb, cis, or custom)
- Store as {{target_module}} for output path determination (used in metadata.module and id)

For Expert agents also ask:

- What sidecar resources? (folder paths, data files, memory files)
- What domain restrictions? (e.g., "only reads/writes to diary folder")

<critical>Check {src_impact} variable to determine output location:</critical>

- If {src_impact} = true: Agent will be saved to {src_output_file}
- If {src_impact} = false: Agent will be saved to {default_output_file}

Store these for later use.
</step>

<step n="2" goal="Define agent persona">
<action>If brainstorming was completed, use the personality insights and character concepts from the brainstorming session</action>

Work with user to craft the agent's personality:

**Role** (1-2 lines):

- Professional title and primary expertise
- Example: "Strategic Business Analyst + Requirements Expert"

**Identity** (3-5 lines):

- Background and experience
- Core specializations
- Years of experience or depth indicators
- Example: "Senior analyst with deep expertise in market research..."

<action>Load the communication styles guide: {communication_styles}</action>
<action>Present the communication style options to the user</action>

**Communication Style** - Choose a preset or create your own!

**Fun Presets:**

1. **Pulp Superhero** - "Strikes heroic poses! Speaks with dramatic flair! Every task is an epic adventure!"
2. **Film Noir Detective** - "The data came in like trouble on a rainy Tuesday. I had a hunch the bug was hiding in line 42..."
3. **Wild West Sheriff** - "Well partner, looks like we got ourselves a code rustler in these here parts..."
4. **Shakespearean Scholar** - "Hark! What bug through yonder codebase breaks?"
5. **80s Action Hero** - "I came here to debug code and chew bubblegum... and I'm all out of bubblegum."
6. **Pirate Captain** - "Ahoy! Let's plunder some data treasure from the database seas!"
7. **Wise Sage/Yoda** - "Refactor this code, we must. Strong with technical debt, it is."
8. **Game Show Host** - "Welcome back folks! It's time to spin the Wheel of Dependencies!"

**Professional Presets:** 9. **Analytical Expert** - "Systematic approach with data-driven insights. Clear hierarchical presentation." 10. **Supportive Mentor** - "Patient guidance with educational focus. Celebrates small wins." 11. **Direct Consultant** - "Straight to the point. No fluff. Maximum efficiency." 12. **Collaborative Partner** - "We'll tackle this together. Your ideas matter. Let's explore options."

**Quirky Presets:** 13. **Cooking Show Chef** - "Today we're whipping up a delicious API with a side of error handling!" 14. **Sports Commentator** - "AND THE FUNCTION RETURNS TRUE! WHAT A PLAY! THE CROWD GOES WILD!" 15. **Nature Documentarian** - "Here we observe the majestic Python script in its natural habitat..." 16. **Time Traveler** - "In my timeline, this bug doesn't exist until Tuesday. We must prevent it!" 17. **Conspiracy Theorist** - "The bugs aren't random... they're CONNECTED. Follow the stack trace!" 18. **Zen Master** - "The code does not have bugs. The bugs have code. We are all one codebase." 19. **Star Trek Captain** - "Captain's Log, Stardate 2024.3: We've encountered a logic error in sector 7. Engaging debugging protocols. Make it so!" 20. **Soap Opera Drama** - "_gasp_ This variable... it's not what it seems! It's been NULL all along! _dramatic pause_ And the function that called it? It's its own PARENT!" 21. **Reality TV Contestant** - "I'm not here to make friends, I'm here to REFACTOR! _confessional cam_ That other function thinks it's so optimized, but I see right through its complexity!"

Or describe your own unique style! (3-5 lines)

<action>If user wants to see more examples or learn how to create custom styles:</action>
<action>Show relevant sections from {communication_styles} guide</action>
<action>Help them craft their unique communication style</action>

**Principles** (5-8 lines):

- Core beliefs about their work
- Methodology and approach
- What drives their decisions
- Start with "I believe..." or "I operate..."
- Example: "I believe that every business challenge has underlying root causes..."

<template-output>agent_persona</template-output>
</step>

<step n="3" goal="Setup optional additions" optional="true">
Ask: **Do you want to add prompts or critical actions? [Yes/no]** (default: No)

If yes, collect:

- Prompts: id + content (referenced with action: "#id" in menu items)
- Critical actions: plain text steps appended to activation during build

Represent these in YAML sections `prompts` and `critical_actions`.

<template-output>agent_enhancements</template-output>
</step>

<step n="4" goal="Build command structure">
<critical>Help and Exit are auto-injected; do NOT add them. Triggers are auto-prefixed with * during build.</critical>

Collect menu items in YAML (examples):

```
menu:
  - trigger: product-brief
    workflow: "{project-root}/bmad/bmm/workflows/1-analysis/product-brief/workflow.yaml"
    description: Produce Project Brief

  - trigger: validate-prd
    workflow: "{project-root}/bmad/bmm/workflows/1-analysis/product-brief/workflow.yaml"
    "validate-workflow": "{output_folder}/prd-draft.md"
    description: Validate PRD Against Checklist

  - trigger: summarize
    action: "#deep-analysis"
    description: Summarize current document

  - trigger: generate-brief
    exec: "{project-root}/bmad/core/tasks/create-doc.md"
    tmpl: "{project-root}/bmad/bmm/templates/brief.md"
    data: "{project-root}/bmad/_data/context.csv"
    description: Generate Project Brief from template
```

<template-output>agent_commands</template-output>
</step>

<step n="5" goal="Activation behavior" optional="true">
BMAD injects activation from fragments automatically based on used attributes (workflow/exec/tmpl/action). Most agents do not need custom activation.

If special steps are required, add them as `critical_actions` (Step 3) so they are appended during build.

<template-output>activation_notes</template-output>
</step>

<step n="6" goal="Generate agent file (YAML)">
Generate a YAML agent at the chosen path. The installer will compile it to `.md` inside `{project-root}/bmad/{{module}}/agents/`.

Example structure:

```yaml
agent:
  metadata:
    id: bmad/{{target_module}}/agents/{{agent_filename}}.md
    name: { { agent_name } }
    title: { { agent_title } }
    icon: { { agent_icon } }
    module: { { target_module } }

  persona:
    role: |
      {{agent_persona.role}}
    identity: |
      {{agent_persona.identity}}
    communication_style: |
      {{agent_persona.communication_style}}
    principles: { { agent_persona.principles } }

  # Optional (from Step 3)
  prompts: []
  critical_actions: []

  menu: { { agent_commands } }
```

<critical>Determine save location based on {src_impact}:</critical>

- If {src_impact} = true: Save to {src_output_file} (src/modules/{{target_module}}/agents/{{agent_filename}}.md)
- If {src_impact} = false: Save to {default_output_file} (output_folder/agents/{{agent_filename}}.md)

<template-output>complete_agent</template-output>
</step>

<step n="7" goal="Create customize file" optional="true">
Ask: **Create a customize YAML for overrides? [Yes/no]** (default: No)

If yes, create at: {config_output_file}

```yaml
# Agent Customization (overrides are merged at build time)
agent:
  metadata:
    name: ''
persona:
  role: ''
  identity: ''
  communication_style: ''
  principles: []
critical_actions: []
prompts: []
menu: []
```

Note: The installer also auto-creates this file from a template if missing.

<template-output>agent_config</template-output>
</step>

<step n="8" goal="Create sidecar resources" if="agent_type == 'expert'">
For Expert agents, help setup sidecar resources:

1. Create folders for domain data
2. Create memory/knowledge files
3. Set up access patterns
4. Document restrictions

<template-output>sidecar_resources</template-output>
</step>

<step n="9" goal="Validate generated agent">
Run validation checks:

1. **YAML structure:**
   - Parses without errors
   - `agent.metadata` has id, name, title, icon, module
   - `agent.persona` complete; principles may be array

2. **Menu validation:**
   - No `*` prefix in triggers (added at build)
   - `description` present for each item
   - Paths use `{project-root}` or valid variables
   - No duplicate triggers

3. **Build check:**
   - Run installer compile to generate `.md` files
   - Confirm `{project-root}/bmad/{{module}}/agents/{{agent_filename}}.md` exists

4. **Type-specific:**
   - Simple/Expert/Module fields make sense and referenced paths exist (or are `todo`)

Show validation results and fix any issues.
</step>

<step n="10" goal="Provide usage instructions">
Provide the user with:

1. **Location of generated agent:**
   - If {src_impact} = true: {{src_output_file}}
   - If {src_impact} = false: {{default_output_file}}

2. **Build to .md:**
   - Run `npm run install:bmad` and choose "Compile Agents" (or `bmad install` → Compile)
   - The installer merges YAML + customize and injects activation and menu handlers

3. **Next steps:**
   - Implement any "todo" workflows
   - Test agent commands
   - Refine persona based on usage
   - Add more commands as needed

4. **For Expert agents:**
   - Populate sidecar resources
   - Test domain restrictions
   - Verify data access patterns

Ask if user wants to:

- Test the agent now
- Create another agent
- Make adjustments
  </step>

</workflow>
