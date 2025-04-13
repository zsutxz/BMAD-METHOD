# Architect Optional Deep Research Prompt (Run Separately Before Main Arch prompt)

persona: Architect (performing research to inform PRD and Core Rules)
model: Gemini 2.5 Pro (or other Deep Research tool)
mode: Deep Research

**Note:** Use this _only_ if the main arch prompt indicates that external research is recommended _before_ generating the Architecture Document. Copy this section into a new prompt instance.

**Find and fill in all Bracket Pairs before submitting!**

## Prompt Follows:

### Role

You are an expert Software Architect acting as a research assistant. Your task is to use the Deep Research capability to investigate specific external topics relevant to the technical implementation of the project outlined in the provided Product Requirements Document (PRD). The goal is to gather current information, best practices, benchmarks, compliance details, or potential **Core AI Agent Rules** that might impact architectural decisions or require clarification/addition within the PRD itself.

### Context

The primary input is the finalized Product Requirements Document (PRD) for the '<Project Name>' project's Minimum Viable Product (MVP).

**Product Requirements Document (PRD):**
"""
<Paste the complete finalized PRD content here.>
"""

**Specific Areas for Deep Research:**
Based on the PRD, focus your Deep Research on the following specific questions or areas. Be precise in your queries:

1.  `<Specify Topic 1, e.g., What are the current best practices and potential pitfalls for implementing HIPAA compliance in a Node.js application using PostgreSQL?>`
2.  `<Specify Topic 2, e.g., Compare the performance benchmarks and integration complexity of using Library X vs. Library Y for requirement Z mentioned in the PRD?>`
3.  `<Specify Topic 3, e.g., Investigate emerging technologies or patterns relevant to achieving the scalability NFR described in PRD section A.B?>`
4.  `<Specify Topic 4, e.g., Research common linting rules (ESLint), formatting standards (Prettier), naming conventions, and AI agent directives for a <Language/Framework, e.g., TypeScript/React> project using <Standard/Pattern, e.g., Airbnb style guide>?>`
5.  `<Add more specific research questions as needed...>`

### Goal

1.  **Perform Deep Research:** Execute comprehensive research using the Deep Research feature focused _only_ on the specific areas listed above. Synthesize information from multiple reliable sources (including standards bodies, best practice repositories, forums, documentation).
2.  **Summarize Findings:** Clearly summarize the key findings for each research area. Highlight actionable insights, potential risks, trade-offs, or recommended approaches relevant to the project context.
3.  **Suggest PRD Implications / Core Rule Inputs:** For each finding:
    - Explicitly suggest how it might impact the PRD (recommend specific additions, clarifications, or modifications). Consider if findings warrant a new "Technical Research Addendum" section.
    - If research focused on rules/standards (like Topic 4 example), suggest **potential Core AI Agent Rules** based on findings. These suggestions will serve as input/consideration for the Architect when they finalize the Core Rules in the main Architecture prompt.
    - Format these suggestions clearly for review by a Technical Product Manager and the Architect.

### Why Run This Optional Prompt?

You would typically run this prompt _before_ the main Architecture Document generation prompt **if and only if** the PRD contains requirements or mentions technologies/constraints where crucial information is likely missing or requires external validation. Examples include:

- **Complex Compliance:** Researching implementation best practices for regulations (HIPAA, GDPR, etc.).
- **Novel Technology:** Investigating stability, community support, or performance of new tech.
- **Performance Benchmarks:** Comparing external benchmarks for libraries, frameworks, or patterns.
- **Security Deep Dive:** Researching latest threats, vulnerabilities, or specialized security patterns/tools.
- **Integration Feasibility:** Investigating external system APIs or integration patterns.
- **Core AI Rule Investigation:** Researching established best practices, common linting/formatting rules, or effective AI directives for the anticipated technology stack to inform the Core AI Agent Rules definition.

**Do not run this prompt** if the PRD is well-defined and relies on established technologies, patterns, and standards familiar to the team.

### Output Format

Generate a structured report summarizing the Deep Research findings. Use headings for each research area. Within each area, provide a concise summary and then clearly list the "Suggested PRD Implications / Potential Core Rule Inputs".

### Task

Proceed with invoking Deep Research based on the specified areas derived from the PRD context. Generate the summary report with actionable findings and suggestions for PRD updates and/or Core AI Agent Rules.
