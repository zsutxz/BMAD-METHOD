# Create IDE Agent Utility

This utility helps you create a new BMAD agent optimized for IDE environments (Cursor, Windsurf, etc.).

**Note for User-Created IDE Agents**: If you're creating a custom IDE agent for your own use (not part of the core BMAD system), prefix the agent ID with a period (e.g., `.api-expert`) to ensure it's gitignored and won't conflict with repository updates.

## Important Constraints

IDE agents must be **compact and efficient** (target: under 2000 characters) to work well as slash commands.

## Process

### 1. Gather Essential Information

Ask the user for:

- **Agent ID**: Short, lowercase identifier (e.g., `api-expert`, `test-engineer`)
- **Slash command**: The command to activate (e.g., `/api`, `/test`)
- **Core purpose**: ONE primary function (IDE agents should be focused)

### 2. Define Minimal Personality

Keep it brief:

- **One-line personality**: A single trait or approach (e.g., "Direct and solution-focused")
- **Expertise**: 2-3 core skills maximum
- **Style**: How they communicate (brief! e.g., "Concise, code-first responses")

### 3. Identify Essential Capabilities

Be selective - IDE agents should be specialized:

- **1-2 primary tasks**: Only the most essential tasks
- **1 template maximum**: Only if absolutely necessary
- **Skip checklists**: Usually too large for IDE agents
- **Reuse existing tasks**: Creating new tasks for IDE agents is rare

### 4. Create the Compact IDE Agent

Create `/bmad-core/ide-agents/{agent-id}.ide.md` with this structure:
(For user-created agents, use `/bmad-core/ide-agents/.{agent-id}.ide.md`)

```markdown
# {Slash Command}

You are {Agent Name}, a {title/role}.

## Expertise
- {Skill 1}
- {Skill 2}
- {Skill 3 if essential}

## Approach
{One sentence about how you work}

## Focus
{One sentence about what you prioritize}

---

When activated with {slash command}, immediately focus on {primary purpose}.
```

### 5. Size Optimization Techniques

To keep agents small:

1. **Remove fluff**: No backstory, minimal personality
2. **Use references**: Reference tasks rather than inline instructions
3. **Be specific**: One job done well is better than many done poorly
4. **Trim lists**: Maximum 3-5 bullet points for any list
5. **Avoid examples**: Let referenced tasks handle examples

### 6. Test the Agent

1. Check character count: `wc -c {agent-file}`
2. Ensure it's under 2000 characters
3. Test in your IDE with the slash command
4. Verify it can access referenced tasks

## Example Questions (Keep it Simple!)

1. "What's the slash command? (e.g., /api)"
2. "What's the ONE thing this agent does best?"
3. "In 5 words or less, describe their personality"
4. "What 1-2 existing tasks do they need?"
5. "Any special focus or constraints?"

## Example: Minimal API Expert

```markdown
# /api

You are Alex, an API design expert.

## Expertise
- RESTful API design
- OpenAPI/Swagger specs
- API security patterns

## Approach
I provide immediate, practical API solutions with example code.

## Focus
Clean, secure, well-documented APIs that follow industry standards.

---

When activated with /api, immediately help with API design, endpoints, or specifications.
```

## Size Comparison

❌ **Too Large** (persona-style):

```markdown
Alex is a seasoned API architect with over 10 years of experience 
building scalable systems. They are passionate about clean design 
and love to share their knowledge. Alex believes that good APIs 
are like good conversations - clear, purposeful, and respectful 
of everyone's time...
```

(Too much personality, not focused)

✅ **Just Right** (IDE-style):

```markdown
You are Alex, an API design expert.
Focus: RESTful design, OpenAPI specs, security patterns.
Style: Direct solutions with example code.
```

(Minimal, focused, actionable)

## Important Notes

- **One agent, one job** - Don't try to do everything
- **Reference, don't repeat** - Use task dependencies
- **Test the size** - Must be under 2000 characters
- **Skip the story** - No background needed for IDE agents
- **Focus on action** - What they DO, not who they ARE
