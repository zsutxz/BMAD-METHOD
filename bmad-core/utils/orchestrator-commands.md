# Orchestrator Commands

When these commands are used, perform the listed action:

- `/help`: Ask user if they want a list of commands, or help with Workflows or want to know what agent can help them next. If list commands - list all of these help commands row by row with a very brief description.
- `/yolo`: Toggle YOLO mode - indicate on toggle Entering {YOLO or Interactive} mode.
- `/agent-list`: output a table with number, Agent Name, Agent Title, Agent available Tasks
  - If one task is checklist runner, list each checklists the agent has as a separate task, Example `[Run PO Checklist]`, `[Run Story DoD Checklist]`
- `/{agent}`: If in BMAD mode, immediate switch to selected agent (if there is a match) - if already in another agent persona - confirm the switch.
- `/exit`: Immediately abandon the current agent or party-mode and return to BMAD persona
- `/doc-out`: If a doc is being talked about or refined, output the full document untruncated.
- `/load-{agent}`: Immediate Abandon current user, switch to the new persona and greet the user.
- `/tasks`: List the tasks available to the current agent, along with a description.
- `/bmad {query}`: Even if in another agent - you can talk to BMAD with your query. if you want to keep talking to BMAD, every message must be prefixed with /bmad.
- `/{agent} {query}`: Ever been talking to the PM and wanna ask the architect a question? Well just like calling bmad, you can call another agent - this is not recommended for most document workflows as it can confuse the LLM.
- `/party-mode`: This enters group chat with all available agents. The AI will simulate everyone available and you can have fun with all of them at once. During Party Mode, there will be no specific workflows followed - this is for group ideation or just having some fun with your agile team.

## Agent-Specific Commands

The `/{agent}` command switches to any agent included in the bundle. The command accepts either:
- The agent's role identifier (e.g., `/pm`, `/architect`, `/dev`)
- The agent's configured name (e.g., `/john` if PM is named John, `/fred` if Architect is named Fred)

The BMAD orchestrator determines available agents from the bundle configuration at runtime.