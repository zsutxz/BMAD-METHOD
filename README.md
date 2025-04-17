# The BMad Code Method for Pairing Human-Agentic Workflow for Product Realization and Software Development

**Breakthrough Method Agile-Ai Driven-Development (BMAD)**

Join in on the [Community Discussion Forum](https://github.com/bmadcode/BMAD-METHOD/discussions), help contribute, evolve, and advance the ideas laid out here. This is IDE Agnostic, works great with Cursor, Cline, RooCode, Augment and Aider! If it has an intelligent agent, this will help you tame it and keep the good vibes flowing!

Also check out [Part 1 on the BMad Code YouTube channel](https://youtu.be/JbhiLUY_V2U) - feel free to comment, like, and subscribe also for future videos and updates.

Note: Depending on which tool you use - the [[prompts folder]](./ai-pm/prompts/) should be set to be ignored my your LLM codebase indexing (ie with cursor add them to .cursorindexingignore - cline and roo may differ).

## Overview

The BMad Method is a (not so) revolutionary approach to software development that leverages AI-driven processes to accelerate and enhance the entire product development lifecycle from ideation and market fit, through agentic code implementation.

The method is meant to be tool agnostic including a workflow built into the role-prompts. It is a somewhat manual workflow that can be used in multiple ways.

It can easily be adapted to specifics of any agentic coding toolset, ide and platform.

## What is the BMad Method?

The BMad Method is a comprehensive, step-by-step approach that transforms a product idea into a fully implemented application agile prompt chain by:

1. Structuring the development process into distinct AI persona-based phases
2. Generating detailed artifacts at each phase
3. Using a sequential workflow to track progress
4. Enabling AI to code the full application based on generated specifications that are granular and detailed, setting you up for maximal success.

## Getting Started

### Prerequisites

- An AI assistant capable of using these prompts (Claude, GPT-4, Gemini, etc.)
- Optional - Recommended: Access to Deep Research AI
- Basic understanding of Cursor / Cline / Roo / CoPilot Agent
- A software product or project idea you want to build with AI

### Workflow

The BMad Method follows a structured workflow:

1. **Idea to Documentation**: Use the prompts in order to generate all necessary project documentation
2. **Agent Rules**: Prompt Output will recommend a baseline set of rules if so desired.
3. **Kanban-style Progress Tracking**: Move generated artifacts through the folders:
   - `1-ToDo`: Sequentially ordered stories waiting to be implemented
   - `2-InProgress`: Stories currently being implemented
   - `3-Done`: Completed stories

## Prompt Sequence

The `prompts` folder contains carefully crafted prompts for each phase of development.
This is for the most broadly ambitious project MVP

1. **Research Assistant: Analysis** (`0-research-assistant.md`): Optional deep research on your product concept
2. **Business Analyst: Project Brief** (`1-business-analyst.md`): Define your product idea and MVP scope
3. **Product Manager: PRD** (`2-PM.md`): Create detailed product requirements
4. **PM/UX/UI: UI Gen Prompt** (`3-PM-UX-Ui.md`): Define comprehensive UI/UX specifications
5. **Architecture Deep Research: PRD Updates** (`4-Arch-Deep.md`): Optional deep research step for Up tp date best practice and rules generation
6. **Architect: Arch Doc** (`5-Arch.md`): Create a detailed architectural blueprint
7. **Technical Product Owner: Epic Story List** (`6-PO.md`): Break down requirements into implementable stories
8. **Technical Scrum Master: Agent Story Files** (`7-SM.md`): Transform stories into Dev Agent ready super detailed stories (it is not recommended to generate all stories with this up front - instead favor using the /role-prompts/dev.md agent with builtin workflow to craft story 1 by 1 as needed to implement.)

## Key Benefits

- **Save Time and Money**: Predictable implementation flow with less costly rework or Agent credit burn that Vibe coding along produces
- **Consistent Documentation**: Generate comprehensive, aligned artifacts
- **AI-Optimized Workflow**: Structured Kanban Stories specifically designed for Human or AI implementation
- **Reduced Technical Debt**: Ensure architectural consistency from the start
- **Simplified Collaboration**: Clear artifacts for all stakeholders, Human and AI

## How To

Recommend checking out this video series starting with [Part 1 on the BMad Code YouTube channel](https://youtu.be/JbhiLUY_V2U) and also checking the [Discussion Forum](https://github.com/bmadcode/BMAD-METHOD/discussions) in the coming days where BMad and the community hopefully will share and collaborate and give further tweaks tips and tricks!

But the **Quick and Dirt**y is:

1. Clone this project
2. Start with the first prompt in `prompts/0-research-assistant.md` (or skip to 1 if research isn't needed) to do market research with an LLM's deep research capabilities
3. Follow each prompt in sequence, providing output from previous steps as context to the new prompt when indicated in the current prompt
4. One the PO generates the final story list, paste it back into the PRD.
5. Generate each detailed user story and implement it 1 by 1. The stories serve as the memory system and history of incremental agile development.
6. Track progress until all stories are completed to realize the MVP.

My recommendation is to take advantage of Google Gemini or ChatGPT web apps for generation of deep research brain storming, PRD, and deep research for the architecture if needed. Beyond that, its easy enough to take the pieces of artifacts needed to put the markdown into the project ai folder, and then use prompts from within the IDE to generate the file architecture, story list updates to the PRD from the PO, and eventual story generation.

## Modifications

This is just an idea of what works for me to increamentally build up complex applications from idea to inception. But I use variants of this to work in existing code bases, where I will lay out a PRD with task lists and use the architecture document to put in place guardrails and further details the LLM needs to understand if it is not already in place.

The sharing of all these prompts are just suggestions - I HIGHLY recommend you use these ideas to tweak and refine what works for you! Experiment with different models, and over time they will improve.

For small projects, just a PRD and the story files can be more than sufficient. And for more ambitious or unknowns, use the brainstorming step and deep research to help you out.

Valid produce artifacts for the application such as source trees, rules, architecture documentation can provide value beyond the initial implementation of the task at hand can can live with the project, usually moved into the docs folder, and also rules can be added to CONTRIBUTING.md. By putting rules in this file, it can be used by humans and ai tools.

For example in cursor, with a good contributing file, you can have an always rule to always reference the contributing.md file for its core rule set. And then if you use Cline or CoPilot, you can do similar with their rule systems or agent custom instructions.

## Future Enhancements

1. BMad Method Tool
2. Improved Gems
3. MCP Version if wanting to do fulling within the IDE
4. Optional Jira Integration
5. Optional Trello Integration

## Contributing

Interested in improving the BMad Method? See our [contributing guidelines](CONTRIBUTING.md).

## License

[Include appropriate license information here]
