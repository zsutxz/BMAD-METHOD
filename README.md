# The BMad Code Method

## Major Update: V2 Final Release

The BMad Method has undergone a significant transformation with our V2 (beta) release! The previous implementation (still available in the `LEGACY-V1` folder) has been replaced by a drastically improved workflow and agent system in the `CURRENT-V2` folder.

## 🔥 Full Demonstration Walkthrough 🔥

**See it in action!** The [`V2-FULL-DEMO-WALKTHROUGH`](./V2-FULL-DEMO-WALKTHROUGH/) folder contains a complete end-to-end demonstration of the BMad Method V2 in action. This isn't just documentation—it's proof of how remarkably effective and powerful Vibe-CEO'ing with the BMAD Method is!

The walkthrough includes:

- **Full Gemini chat transcripts** for every phase of the process
- **All output artifacts** that flow between agents
- **Detailed commentary** on the interactive process

What makes this demo exceptional is seeing how the agents work in **interactive phases**, pausing at key decision points for human input rather than dumping massive documents at once. No other AI development methodology provides this level of collaborative workflow with documented results where the agent works with you step by step.

[Explore the demo](./V2-FULL-DEMO-WALKTHROUGH/) and see how this transforms software development from ideation to implementation-ready agent stories and tasks.

## What's New in V2?

- **Optimized Agent Prompts**: Completely revised agent prompts for better outputs
- **Standardized Templates**: Comprehensive set of templates for consistent document creation
- **Streamlined Workflow**: Clearer process from idea to deployment
- **Improved Agile Integration**: Better support for agile methodologies
- **Agent vs Gem Agent Distinction**: V2 has specific [gems](#custom-gems-and-gpts) (agent with embedded templates) in parity with the IDE agents.
- **Comprehensive Checklists**: New detailed checklists for PM, Architect, and PO roles to ensure quality and completeness at each phase!
- **Multi-Mode Agents**: Each agent now operates in distinct modes tailored to different project phases or complexity levels - allowing flexibility to match your project needs and knowledge level
- **Reduced Redundancy**: V2 agents and gems use consistent XML-tagged formatting optimized for LLMs, making them more efficient and easier to maintain
- **Dev-SM Parity**: The stories produced by the SM agent maintain parity with what the Dev agent is told to load on its own and expects, reducing duplication and ensuring smooth handoffs. If not using the dev agent custom mode, ensure your IDE agent rules include all information from the dev agent for compatibility. For example, the dev agent knows to load docs/coding-standards and project-structure - so this should not be repeated (but might be linked) in the generated stories.

## No Rules Required!

One of the biggest advantages of the BMad Method is that it doesn't require custom rules when using the custom agents. The dev agents and other personas are configured to automatically reference standards documents when coding. This provides two major benefits:

1. **No Platform Lock-in**: Work across any AI system without being tied to proprietary rule formats
2. **Maximum Flexibility**: Still compatible with rules-based systems like Claude or Cursor if you prefer that approach

This flexibility allows you to choose the implementation that works best for your workflow while maintaining consistent quality across your project.

## IDE Agent Integration

The BMad Method now includes detailed [instructions for setting up custom agent modes](./CURRENT-V2/agents/instructions.md) in various IDEs. For the most direct translation of the full agent system, especially for the crucial SM and Dev agent roles, the following are recommended:

- **RooCode**: Excellent custom mode support with robust file permission controls and mode switching
- **Cursor**: Strong custom agent capabilities with advanced context management

Both provide an optimal experience for implementing the BMAD workflow, though the method can be adapted to work with any IDE. See the full [instructions file](./CURRENT-V2/agents/instructions.md) for details on configuring each supported IDE.

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

## Custom Agent Overview

### Analyst (Business Analyst (BA), Research Assistant (RA), Brainstorming Coach)

The Analyst agent is a versatile entry point into the BMad Method, operating in three distinct modes to help transform initial ideas or vague concepts into well-defined project briefs through creative ideation techniques, market analysis, or structured requirement gathering. This agent is ideal for users who need help refining their vision before moving to detailed product definition.

#### Brainstorming Coach Mode

This mode uses proven brainstorming techniques like SCAMPER and "What if" scenarios to expand possibilities. The agent guides users through structured ideation frameworks, encourages divergent thinking, and helps challenge assumptions that might be limiting creativity.

#### Deep Research Mode

This mode generates comprehensive research prompts to explore market needs, competitors, and target users. It focuses on executing deep research into market conditions, industry trends, competitive landscape, and user needs to inform the project direction.

#### Project Briefing Mode

This mode collaboratively builds a structured brief document with a dedicated PM Agent Handoff Prompt section that provides strategic guidance for the next phase. It leverages research findings and user input to create a well-defined project brief that serves as the foundation for product development.

With the final V2 release, this mode is like magic - working with you as a partner coach and brainstorming master - helping you find the idea in that nugget of a vision - especially when using in Gemini 2.5 pro thinking. As a bonus, you can even take your output eventual project brief and use it as a basis for another round of brainstorming to further refine before handing to the PM (this was a happy accident I discovered that worked out really well).

### Product Manager (PM)

The Product Manager agent excels at transforming high-level project briefs or initial ideas into comprehensive product specifications and actionable development plans. As a scope refinement specialist, the PM actively challenges assumptions about what features are truly necessary for the MVP, seeking opportunities to reduce complexity while ensuring perfect alignment with core business goals.

#### Mode 1: Initial Product Definition

In this mode, the PM creates the core product definition documents for the MVP from scratch. The agent produces three key artifacts: a detailed Product Requirements Document (PRD) outlining goals, functional and non-functional requirements; a set of epic definitions that break down the work into independently deployable chunks; and an Initial Architect Prompt that captures critical technical decisions. Throughout the process, the PM engages in multiple rounds of scope refinement—first during initial scoping discussions, then after drafting the PRD, and finally after creating epics—always framing conversations around time, cost, and quality tradeoffs. The PM also identifies deployment considerations and testing requirements, ensuring each epic builds logically on previous ones with Epic 1 containing all necessary infrastructure setup.

This mode is now like magic when operating within Google Gemini 2.5 Pro thinking - it stops confirms and explains every choice and description so clearly it makes the process painless and will guide you every step of the way. Please enjoy the final V2 release!

#### Mode 2: Product Refinement & Advisory

In this mode, which activates when a PRD already exists and is approved, the PM serves as an ongoing product advisor to provide clarification on existing requirements, facilitate modifications as the product evolves, assess the impact of proposed changes, manage scope adjustments, and maintain consistent, up-to-date product documentation throughout the development process.

### Architect

The Architect agent is an expert Solution/Software Architect that operates in three distinct modes to support technical design throughout the product development lifecycle. With deep knowledge across cloud platforms, architectures, databases, and programming languages, the Architect translates requirements into robust, scalable technical designs optimized for AI agent implementation.

#### Mode 1: Deep Research Prompt Generation

This mode creates comprehensive research prompts to investigate technology options, platforms, services, and implementation approaches before making architectural decisions. The Architect analyzes available project context, identifies research gaps, and structures detailed prompts that define clear objectives, outline specific questions, request comparative analysis, and establish evaluation frameworks for decision-making.

**Gem Mode Bonus**: The GEM version includes an extensive example research prompt template for backend technology stack evaluation that demonstrates how to structure comprehensive technology investigations. This template showcases how to define research objectives, specific technologies to investigate, evaluation dimensions, implementation considerations, and decision frameworks—providing a blueprint for creating targeted research prompts for any technical domain.

#### Mode 2: Architecture Creation

In this mode, the Architect designs and documents the complete technical architecture based on the PRD, epics, and project brief. The agent makes definitive technology decisions (not open-ended options), explains the rationale behind key selections, and produces all necessary technical artifacts including detailed architecture documentation, tech stack specifications, project structure, coding standards, API references, data models, environment variables, and testing strategies—all optimized for implementation by AI agents.

This mode is now like magic when operating within Google Gemini 2.5 Pro thinking - it stops confirms and explains every choice and description so clearly it makes the process painless and will guide you every step of the way. Please enjoy the final V2 release!

#### Mode 3: Master Architect Advisory

This mode provides ongoing technical guidance throughout the project, explaining concepts, suggesting updates to artifacts, and managing technical direction changes. The Architect assesses change impacts across the project, recommends minimally disruptive approaches for course corrections, identifies technical debt, and ensures all significant decisions are properly documented. The agent uses clear Mermaid diagrams to visually represent system structure and interactions when beneficial for clarity.

### Product Owner (PO)

The Product Owner agent serves as the validation and quality assurance checkpoint for the entire MVP plan before development begins. Using a comprehensive validation checklist, the PO agent systematically reviews all project artifacts to ensure they are complete, well-structured, and properly aligned. The PO agent verifies proper project setup and initialization steps, validates infrastructure and deployment sequencing, confirms all external dependencies are properly addressed, delineates user versus agent responsibilities, ensures features are correctly sequenced with dependencies managed, validates that all MVP goals from the PRD are addressed in epics/stories, and checks that all technical requirements are satisfied. The agent also evaluates risk management strategies, documentation completeness, and verifies that post-MVP considerations are properly handled. This systematic validation process helps catch potential issues early, ensuring the development phase proceeds smoothly.

### Scrum Master (SM)

The Scrum Master agent serves as the technical bridge between approved plans and executable development tasks. As an expert Technical Scrum Master/Senior Engineer, this agent systematically identifies the next logical story to implement based on dependencies and prerequisites, extracting only the necessary technical context from reference documents to create self-contained story files. The SM operates in a process-driven workflow that includes checking prerequisite states, gathering relevant requirements and technical context, populating standardized story templates, validating story completeness against a checklist, and marking stories as ready for development. This agent flags missing or contradictory information as blockers, focuses on providing adequate context without over-specifying implementation details, and ensures each story contains specific testing requirements and acceptance criteria.

### PO-SM (Gem) Combined

The PO-SM Gem agent is a dual-mode specialist that operates in two distinct capacities:

#### PO Mode (Plan Validator)

In Product Owner mode, this agent conducts comprehensive validation of the complete MVP plan before development starts. The agent systematically works through a detailed checklist to verify foundational implementation logic, technical sequence viability, and PRD alignment. It evaluates proper initialization steps, infrastructure sequencing, user vs. agent action appropriateness, and external dependency management. The agent makes a definitive "Go/No-Go" decision, either approving the plan or providing specific, actionable feedback for addressing deficiencies.

The PO mode within the IDE (Agent folder) version is the main agent that generates a project root `docs/_index.ts`, or updates it if needed as more docs are created - a great V2 addition that will allow future agents a directory to discover all the great docs you produce for your repo, and link to from the main repo. This is the future of agent knowledge of how to work within your repo as it grows and future agents evolve.

#### SM Mode (Story Generator)

Once the plan is approved, the agent transitions to Scrum Master mode, where it identifies remaining stories, gathers technical context, and generates comprehensive story files following standard templates. In this mode, the agent extracts only story-specific information from reference documents, populates templates with appropriate details, and formats each story with clear section titles and boundaries. The agent can generate a complete report of all remaining stories organized in logical sequence based on dependencies.

### Dev Agent (Dev)

The Developer agent is an expert software developer implementing requirements from assigned story files. This agent focuses exclusively on story implementation while following project standards, working sequentially through tasks defined in the story file. The Dev agent adheres strictly to coding standards and project structure without needing these repeated in each story, implements tests according to project testing strategy, and reports progress by updating story status. The agent operates with focused autonomy, asking questions only when genuinely blocked by ambiguity, attempting to resolve issues using available documentation first. Upon completion of all tasks and verification that tests pass, the Dev agent marks the story for review and awaits feedback before deployment.

## Step-by-Step Process

### Phase 0: Ideation (Optional)

1. Start with the **Business Analyst (BA)** agent if your idea is vague
2. The BA will help analyze market conditions and competitors
3. Output is a **Project Brief** used as input for the Product Manager

If you are unsure, start by saying something like the following to brainstorm with the BA with this simple goal eliciting prompt:

- I have an idea for an app I want to brainstorm with you,
- it can do (X)
- so that (y)
- for (Z) user(s)

  **Example:** 'I have an idea for an app I want to brainstorm with you, it can **help small business owners automatically** generate professional social media content, so that they can **maintain consistent online presence without hiring expensive marketing agencies**, for **time-starved entrepreneurs** who know social media is important but don't have the skills or time to create quality content daily'

### Phase 1: Product Definition

1. The **Product Manager (PM)** agent takes the project brief or your idea
2. PM creates a comprehensive Product Requirements Document (PRD) along with high level epic / story flow docs. (Separate files reduce overall context for future agents - this is in the V2+ version)
3. Initial epic breakdowns are drafted

### Phase 2: Technical Design

1. The **Architect** agent reviews the PRD and creates an architecture document and in V2 granular artifacts that optimize for LLM context space of chosen future agents!
2. Architect identifies technical dependencies and reference files
3. Optional: Use Deep Research mode for more in-depth technical exploration

### Phase 3: Refinement and Validation

1. PM, Architect, and Scrum Master collaborate to refine the plan
2. **Product Owner (PO)** validates scope, story sequence, and PRD alignment
3. Final documents are approved and indexed

### Phase 4: Story Generation

1. **Technical Scrum Master** generates each story 1 at a time for the dev to complete, (OR in Gem/GPT mode it will do all remaining stories). The output story or stories are highly detailed stories with all technical details the agent will need to keep instructional context lean - not having to search all of the larger documents bloating its context with unnecessary information.

### Phase 5: Development

1. The **Developer Agent** works on stories one at a time
2. Developer creates draft stories for review before implementation
3. Code and tests are committed, and story files are updated

### Phase 6: Review and Acceptance

1. Code reviews by a new Dev Agent or Architect
2. Functionality reviews by User/QA
3. Story marked as Done when approved

### Phase 6.5: Refactor (Optional Step)

1. Architect or Dev Agent in a new Content, or the User, refactor as needed and ensure if refactor changes structure that source tree diagrams and future implementation documents are updated as needed.
2. This is not required after most stories with properly following the phases before #5 producing a solid plan and architecture - but even the best plans can lead to the emergence of an idea for beautiful restructuring. Also, best laid plans can still lead to an agent doing less than ideal things that are better to correct.
3. Remember, the main key with refactoring at this stage is ensure all was working first, the full app and new functionality has passing tests and linting, has been committed, and pushed to the remote branch. Only then would I take on a major (or even minor refactor) in most cases. If I am doing the refactor myself, I have more trust and might do it before pushing and calling the story done. But with the agent, always lock down your working changes so you have an escape hatch to revert to!

### Phase 7: Deployment

1. Developer Agent handles deployments
2. Infrastructure as Code is used for deployment commands
3. System is updated with the new functionality

## Template Dependencies

**Important:** The agents (not gems) in this system rely on template files located in the `CURRENT-V2/docs/templates` folder. These templates should remain named as they are for proper functionality and put in your projects docs/templates folder, including:

- `architecture.md`
- `story-template.md`
- `prd.md`
- `project-brief.md`
- etc... (all of the template files)

## Custom GEMs and GPTs (Highly Recommended)

**Using Agents with Web-Based AI Interfaces (Highly recommended, save lots of money, larger context windows, deep research is a game changer)**

The [gems folder](./CURRENT-V2/gems-and-gpts/) contains agent instructions embedded with optimized web use instructions - streamlined for usage within the [Gemini Gems](https://gemini.google.com/gems/create), or [OpenAIs custom GPT's](https://chatgpt.com/gpts/editor). With both custom GPTs and Gemini Gems, you will attach the templates now instead of embedding them (as was the case with V1 of this system, that was not as easy to modify). This way, as you modify templates from the templates folder, if you want to change it in the web version just save it as a .txt extension and attach to the custom GEM or GPT.

[Detailed set up and usage instructions](./CURRENT-V2/gems-and-gpts/instruction.md) are available in the folder also.

## IDE Integration

The method works with any IDE or AI assistant with these approaches:

- **Custom Modes**: For IDEs that support custom modes (Cursor, RooCode)
- **Custom Gems**: For Gemini, create a Custom Gem for each agent
- **Direct Prompting**: For any AI assistant, use the agent prompts directly

## License

[License](./LICENSE)

## Contributing

Interested in improving the BMad Method? See our [contributing guidelines](CONTRIBUTING.md).
