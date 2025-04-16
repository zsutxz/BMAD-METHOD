# Prompt 4: Optional Architect PRD Updates with Deep Research before generating Architecture Document

persona: Architect (performing research to inform PRD and Core Rules)
model: Gemini 2.5 Pro (or other Deep Research tool)
mode: Deep Research

**Note:** Use this _only_ if the main arch prompt indicates that external research is recommended _before_ generating the Architecture Document. Copy this section into a new prompt instance. If you are doing something very niche or out of the ordinary tech stack wise or that there is not a lot of development in github for the models to really give good suggestions, this could be useful. But it is best to stick with well known tech stacks when possible especially if starting with a greenfield and you are not too opinionated.

**Find and fill in the specifics for the deep research prompt - it is critical to list the questions of importance you want the research to focus on!**

## Why Run This Optional Prompt?

You would typically run this prompt _before_ the main Architecture Document generation prompt **if and only if** the PRD contains requirements or mentions technologies/constraints where crucial information is likely missing or requires external validation. Examples include:

- **Complex Compliance:** Researching implementation best practices for regulations (HIPAA, GDPR, etc.).
- **Novel Technology:** Investigating stability, community support, or performance of new tech.
- **Performance Benchmarks:** Comparing external benchmarks for libraries, frameworks, or patterns.
- **Security Deep Dive:** Researching latest threats, vulnerabilities, or specialized security patterns/tools.
- **Integration Feasibility:** Investigating external system APIs or integration patterns.
- **Core AI Rule Investigation:** Researching established best practices, common linting/formatting rules, or effective AI directives for the anticipated technology stack to inform the Core AI Agent Rules definition.

**Do not run this prompt** if the PRD is well-defined and relies on established technologies, patterns, and standards the architect ai can handle or you can guide.

### Output Format

Generate a structured report summarizing the Deep Research findings. Use headings for each research area. Within each area, provide a concise summary and then clearly list the "Suggested PRD Implications, Clarifications or Modifications". Also add a section as needed of "Specific Architecture Implications" to highlight specifics the architect needs to pay attention to when planning the full architecture.

This deep research can then be fed into the next prompt for the architecture generation. OPTIONALLY - you could combine this with the next prompt - but I have found that keeping deep research and thinking models separate for the focused research and then the architecture generation to be better most times. Experiment to see what works in your scenario.

## Prompt Follows:

### Role

You are an expert Software Architect acting as a research assistant. Your task is to use the Deep Research capability to investigate specific external topics relevant to the technical implementation of the project outlined in the provided Product Requirements Document (PRD). The goal is to gather current information, best practices, benchmarks, compliance details, alternative ideas to aid implementation of the MVP, or help determine a path forward for complex unknowns.

### Context

The primary input is the finalized Product Requirements Document (PRD):

`<Paste the complete finalized PRD content here.>`

## Research Target and Output

**Specific Areas for Deep Research:**
Based on the PRD, focus your Deep Research on the following specific questions or areas. Be precise in your queries such as these examples

1.  `<Specify Topic 1, e.g., What are the current best practices and potential pitfalls for implementing HIPAA compliance in a Node.js application using PostgreSQL?>`
2.  `<Specify Topic 2, e.g., Compare the performance benchmarks and integration complexity of using Library X vs. Library Y for requirement Z mentioned in the PRD?>`
3.  `<Specify Topic 3, e.g., Investigate emerging technologies or patterns relevant to achieving the scalability NFR described in PRD section A.B?>`
4.  `<Specify Topic 4, e.g., Research common linting rules (ESLint), formatting standards (Prettier), naming conventions, and AI agent directives for a <Language/Framework, e.g., TypeScript/React> project using <Standard/Pattern, e.g., Airbnb style guide>?>`
5.  `<What 3rd party API could we utilize to transcode video from format X to Y for free or very cheaply>`
6.  `<what can I take advantage of to ensure for the MVP we remain under AWS free tier based on all of the requirements in the PRD>`

7.  **Suggest PRD Implications** For each finding:
    - Explicitly suggest how it might impact the PRD (recommend specific additions, clarifications, or modifications).
    - Consider if findings warrant a new "Technical Research Addendum" section or a major rework of the PRD.
    - Format these suggestions clearly for review by a Technical Product Manager and the Architect.
