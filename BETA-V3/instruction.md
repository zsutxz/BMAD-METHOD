# Instructions

- [Web Agent Setup](#setting-up-web-mode-agents-in-gemini-gem-or-chatgpt-custom-gpt)
- [IDE Agent Setup](#ide-agent-setup)
- [Tasks Setup and Usage](#tasks)

## Setting up Web-Mode Agents in Gemini Gem or ChatGPT Custom GPT

To set up web-mode agents, please refer to the table below. It outlines the agent name, the source file for its description, and any checklist or template files that need to be attached.

| Agent Name         | Description File Path                           | Attachment Files (Checklists/Templates)                                                                                                                                        |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0-bmad             | `BETA-V3/web-agent-modes/0-bmad.md`             |                                                                                                                                                                                |
| 1-analyst          | `BETA-V3/web-agent-modes/1-analyst.md`          | `BETA-V3/templates/project-brief-tmpl.txt`                                                                                                                                     |
| 2-pm               | `BETA-V3/web-agent-modes/2-pm.md`               | `BETA-V3/checklists/pm-checklist.txt`, `BETA-V3/templates/prd-tmpl.txt`                                                                                                        |
| 3-architect        | `BETA-V3/web-agent-modes/3-architect.md`        | `BETA-V3/templates/architecture-tmpl.txt`, `BETA-V3/checklists/architect-checklist.txt`                                                                                        |
| 4-design-architect | `BETA-V3/web-agent-modes/4-design-architect.md` | `BETA-V3/templates/front-end-architecture-tmpl.txt`, `BETA-V3/templates/front-end-spec-tmpl.txt`, `BETA-V3/checklists/frontend-architecture-checklist.txt`                     |
| 5-posm             | `BETA-V3/web-agent-modes/5-posm.md`             | `BETA-V3/checklists/po-master-checklist.txt`, `BETA-V3/templates/story-tmpl.txt`, `BETA-V3/checklists/story-draft-checklist.txt`, `BETA-V3/checklists/story-dod-checklist.txt` |

## IDE Agent Setup

The IDE Agents in V3 have all been optimized to be under 6k total size to be compatible with Windsurf, and generally more optimized for IDE usage! Ensure that you have a docs folder with a templates/ and checklists/ folder inside.

### Cursor

Cursor will only (at this time) support up to 5 custom agents - so for cursor its highly recommended to use the web version for the agents that can be used there, and save agent custom mode set up in the IDE to the ones that make sense there - at a minimum - dev agent, sm agent. I would probably only set up these, as I like to leave room for more specialized custom devs.

Tasks are introduced in V3, and Workflows are also coming - which will soon allow a more generic agile pro agent to handle most of the prework that multiple agents do now.

#### Setting Up Custom Modes in Cursor

1. **Access Agent Configuration**:

   - Navigate to Cursor Settings > Features > Chat & Composer
   - Look for the "Rules for AI" section to set basic guidelines for all agents

2. **Creating Custom Agents**:

   - Custom Agents can be created and configured with specific tools, models, and custom prompts
   - Cursor allows creating custom agents through a GUI interface
   - See [Cursor Custom Modes doc](https://docs.cursor.com/chat/custom-modes#custom-modes)

3. **Configuring BMAD Method Agents**:

   - Define specific roles for each agent in your workflow (Analyst, PM, Architect, PO/SM, etc.)
   - Specify what tools each agent can use (both Cursor-native and MCP)
   - Set custom prompts that define how each agent should operate
   - Control which model each agent uses based on their role
   - Configure what they can and cannot YOLO

### Windsurf

All V3 Agents have been optimized to be under 6K character limit, great for Windsurf usage now!

#### Setting Up Custom Modes in Windsurf

1. **Access Agent Configuration**:

   - Click on "Windsurf - Settings" button on the bottom right
   - Access Advanced Settings via the button in the settings panel or from the top right profile dropdown

2. **Configuring Custom Rules**:

   - Define custom AI rules for Cascade (Windsurf's agentic chatbot)
   - Specify that agents should respond in certain ways, use particular frameworks, or follow specific APIs

3. **Using Flows**:

   - Flows combine Agents and Copilots for a comprehensive workflow
   - The Windsurf Editor is designed for AI agents that can tackle complex tasks independently
   - Use Model Context Protocol (MCP) to extend agent capabilities

4. **BMAD Method Implementation**:
   - Create custom agents for each role in the BMAD workflow
   - Configure each agent with appropriate permissions and capabilities
   - Utilize Windsurf's agentic features to maintain workflow continuity

### RooCode

#### Setting Up Custom Agents in RooCode

1. **Custom Modes Configuration**:

   - Create tailored AI behaviors through configuration files
   - Each custom mode can have specific prompts, file restrictions, and auto-approval settings

2. **Creating BMAD Method Agents**:

   - Create distinct modes for each BMAD role (Analyst, PM, Architect, PO/SM, Dev, Documentation, etc...)
   - Customize each mode with tailored prompts specific to their role
   - Configure file restrictions appropriate to each role (e.g., Architect and PM modes may edit markdown files)
   - Set up direct mode switching so agents can request to switch to other modes when needed

3. **Model Configuration**:

   - Configure different models per mode (e.g., advanced model for architecture vs. cheaper model for daily coding tasks)
   - RooCode supports multiple API providers including OpenRouter, Anthropic, OpenAI, Google Gemini, AWS Bedrock, Azure, and local models

4. **Usage Tracking**:
   - Monitor token and cost usage for each session
   - Optimize model selection based on the complexity of tasks

### Cline

#### Setting Up Custom Agents in Cline

1. **Custom Instructions**:

   - Access via Cline > Settings > Custom Instructions
   - Provide behavioral guidelines for your agents

2. **Custom Tools Integration**:

   - Cline can extend capabilities through the Model Context Protocol (MCP)
   - Ask Cline to "add a tool" and it will create a new MCP server tailored to your specific workflow
   - Custom tools are saved locally at ~/Documents/Cline/MCP, making them easy to share with your team

3. **BMAD Method Implementation**:

   - Create custom tools for each role in the BMAD workflow
   - Configure behavioral guidelines specific to each role
   - Utilize Cline's autonomous abilities to handle the entire workflow

4. **Model Selection**:
   - Configure Cline to use different models based on the role and task complexity

### GitHub Copilot

#### Custom Agent Configuration (Coming Soon)

GitHub Copilot is currently developing its Copilot Extensions system, which will allow for custom agent/mode creation:

1. **Copilot Extensions**:

   - Combines a GitHub App with a Copilot agent to create custom functionality
   - Allows developers to build and integrate custom features directly into Copilot Chat

2. **Building Custom Agents**:

   - Requires creating a GitHub App and integrating it with a Copilot agent
   - Custom agents can be deployed to a server reachable by HTTP request

3. **Custom Instructions**:
   - Currently supports basic custom instructions for guiding general behavior
   - Full agent customization support is under development

_Note: Full custom mode configuration in GitHub Copilot is still in development. Check GitHub's documentation for the latest updates._

## Tasks

The Tasks can be copied into your project docs/tasks folder, along with the checklists and templates. The tasks are meant to reduce the amount of 1 off IDE agents - you can just drop a task into chat with any agent and it will perform the 1 off task. There will be full workflow + task coming post V3 that will expand on this - but tasks and workflows are a powerful concept that will allow us to build in a lot of capabilities for our agents, without having to bloat their overall programming and context in the IDE - especially useful for tasks that are not used frequently - similar to seldom used ide rules files.
