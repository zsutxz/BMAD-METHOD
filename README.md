# The BMAD-Method V4 (Breakthrough Method of AgileAI Driven Development)

## Getting Started

### For Web (Gem/Custom GPT)

1. Install Node.js
2. Run `npm run build` to produce the web output
3. Choose from the `dist/` folder:
   - **Team bundles**: Fully self-contained files with multiple agents
   - **Individual persona bundles**: Single agent files
   - You only select 1 file for 1 Gem/GPT - either a team or individual.
   - All Teams include the BMad Agent.

NOTE: BMad Agent KB has not been updated for V4 yet - so its knowledge is not ideal yet.

#### Setting up your Gem/Custom GPT

- **For team builds**: Set the description to: "You are the BMAD Agent. Follow the orchestrator's operating instructions and persona immediately."
- **For individual builds**: Set the description to: "You are the [Agent Name]. Follow the persona instructions immediately."
- Configuration for all of these are now done in the root agents folder. You can easily build various team bundles to include only the agents you want or need!

### For IDE

Copy the entire `bmad-core/` folder to your project root to get started. The `bmad-core/ide-agents` includes all of the individual agents.

SPECIAL CURSOR, WINDSURF, VSCode and CLAUDE_CODE note (or any ide for that matter): Rules and commands are the key to being able to easily use and switch between agents in the IDE now! You can see examples for cursor, windsurf and claude already, by looking in the .cursor or .claude/commands folder. Set up slash commands as these show and you will be able to use endless custom agents regardless of your choice of IDE or agentic coding partner!

## Old Versions

[Prior Version 1](https://github.com/bmadcode/BMAD-METHOD/tree/V1)
[Prior Version 2](https://github.com/bmadcode/BMAD-METHOD/tree/V2)
[Prior Version 3](https://github.com/bmadcode/BMAD-METHOD/tree/V3)

## End Matter

Interested in improving the BMAD Method? See the [contributing guidelines](docs/CONTRIBUTING.md).

Thank you and enjoy - BMad!
[License](docs/LICENSE)
