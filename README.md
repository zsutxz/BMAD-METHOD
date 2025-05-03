# The BMad Code Method

## Major Update: V2 (beta) Release

The BMad Method has undergone a significant transformation with our V2 (beta) release! The previous implementation (still available in the `LEGACY-V1` folder) has been replaced by a drastically improved workflow and agent system in the `CURRENT-V2` folder.

## What's New in V2?

- **Optimized Agent Prompts**: Completely revised agent prompts for better outputs
- **Standardized Templates**: Comprehensive set of templates for consistent document creation
- **Streamlined Workflow**: Clearer process from idea to deployment
- **Improved Agile Integration**: Better support for agile methodologies

## No Rules Required!

One of the biggest advantages of the BMad Method is that it doesn't require custom rules when using the custom agents. The dev agents and other personas are configured to automatically reference standards documents when coding. This provides two major benefits:

1. **No Platform Lock-in**: Work across any AI system without being tied to proprietary rule formats
2. **Maximum Flexibility**: Still compatible with rules-based systems like Claude or Cursor if you prefer that approach

This flexibility allows you to choose the implementation that works best for your workflow while maintaining consistent quality across your project.

## What is the BMad Method?

The BMad Method is a revolutionary approach that elevates "vibe coding" to the next level—what I call "Vibe CEOing." Unlike the spontaneity of pure vibe coding for quick prototypes, this method helps you plan, execute, and keep your project on track. Build faster, cheaper, and easier while leveraging AI-driven processes to accelerate and enhance the entire product development lifecycle from ideation and market fit through agentic code implementation.

This V2 release incorporates valuable feedback from V1 users and draws inspiration from projects like Claude's memory bank and the Taskmaster project. However, the BMad Method goes further by providing a comprehensive framework for those who want to thoroughly define and develop projects from conception to completion.

This comprehensive, step-by-step approach transforms a product idea into a fully implemented application by:

1. Structuring the development process into distinct AI persona-based phases
2. Generating detailed artifacts at each phase
3. Using a sequential workflow to track progress
4. Enabling AI to code the full application based on generated specifications

The method is tool agnostic with a workflow built into the role-prompts, making it adaptable to any agentic coding toolset, IDE, or platform.

Join the [Community Discussion Forum](https://github.com/bmadcode/BMAD-METHOD/discussions) to help contribute and evolve these ideas.

### Video Tutorials

- The legacy workflow is explained in [Part 1 and 2 on the BMad Code YouTube channel](https://youtu.be/JbhiLUY_V2U)
- A new tutorial for the V2 workflow will be coming soon - with a full end to end project build!

## Coming Soon(ish)

- A fully output of a simple and advanced project artifact files of executing the agents to build all the artifacts for a project build with prompt examples that lead to the output from the agents.
- Exploration into leveraging MCP.

## Workflow Visual Diagram

[View Diagram](./workflow-diagram.md)

## Step-by-Step Process

### Phase 0: Ideation (Optional)

1. Start with the **Business Analyst (BA)** agent if your idea is vague
2. The BA will help analyze market conditions and competitors
3. Output is a **Project Brief** used as input for the Product Manager

### Phase 1: Product Definition

1. The **Product Manager (PM)** agent takes the project brief or your idea
2. PM creates a comprehensive Product Requirements Document (PRD)
3. Initial epic breakdowns are drafted

### Phase 2: Technical Design

1. The **Architect** agent reviews the PRD and creates an architecture document
2. Architect identifies technical dependencies and reference files
3. Optional: Use Deep Research mode for more in-depth technical exploration

### Phase 3: Refinement and Validation

1. PM, Architect, and Scrum Master collaborate to refine the plan
2. **Product Owner (PO)** validates scope, story sequence, and PRD alignment
3. Final documents are approved and indexed

### Phase 4: Story Generation

1. **Technical Scrum Master** generates stories using the story template
2. Each story has clear acceptance criteria and technical details

### Phase 5: Development

1. The **Developer Agent** works on stories one at a time
2. Developer creates draft stories for review before implementation
3. Code and tests are committed, and story files are updated

### Phase 6: Review and Acceptance

1. Code reviews by Tech SM/Architect
2. Functionality reviews by User/QA
3. Story marked as Done when approved

### Phase 7: Deployment

1. Developer Agent handles deployments
2. Infrastructure as Code is used for deployment commands
3. System is updated with the new functionality

## Template Dependencies

**Important:** The agents in this system rely on template files located in the `CURRENT-V2/docs/templates` folder. These templates should remain named as they are for proper functionality, including:

- `architecture.md`
- `story-template.md`
- `prd.md`
- `project-brief.md`
- And more specific templates for various document types

## Using Agents with Web-Based AI Interfaces (Highly recommended, save lots of money, larger context windows, deep research is a game changer)

If you plan to use the agents in web interfaces like Gemini Web or OpenAI Web, we recommend:

1. For Analyst, Architect, PM/PO, and SM agents:

   - Either paste the templates into your web session
   - Or modify the agent prompt to include the template as an addendum
   - Change file paths references to point to the document itself rather than external files

2. Implementation approaches:
   - **Recommended:** Add the template content directly into the prompt as an addendum
   - Reference the template in the document rather than as an external file

## Getting Started

1. Clone this repository
2. Set up your AI assistant custom agents in your IDE OR (recommended) some of them in Gemini
3. Start with the BA or PM agent depending on how well-defined your idea is
4. Follow the workflow phases sequentially until you have your epics all lined up and you (and the PO) are happy with the proposed epic sequence.

## IDE Integration

The method works with any IDE or AI assistant with these approaches:

- **Custom Modes**: For IDEs that support custom modes (Cursor, RooCode)
- **Custom Gems**: For Gemini, create a Custom Gem for each agent
- **Direct Prompting**: For any AI assistant, use the agent prompts directly

## License

[License](./LICENSE)

## Contributing

Interested in improving the BMad Method? See our [contributing guidelines](CONTRIBUTING.md).
