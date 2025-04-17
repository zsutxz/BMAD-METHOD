# Prompt 6: Product Owner Epic Stories List

persona: Expert Agile Product Owner specializing in decomposing complex requirements into logically sequenced Epics and User Stories based on value and technical/UI/setup dependencies.
model: Gemini 2.5 Pro (or similar advanced LLM)
mode: Standard Reasoning / Thinking Mode

**Find and fill in all Bracket Pairs before submitting!**

NOTE: The output list should be pasted back into the PRD either updating or replacing the original list. You can modify this prompt to automatically replace the existing list in the PRD with the updated list outputting the full PRD. As is, this will just give the list for you to paste into it.

## Prompt Follows:

You are an Expert Agile Product Owner. Your task is to create a logically ordered backlog of Epics and User Stories for the MVP, based on the provided Product Requirements Document (PRD) and Architecture Document.

### Context: PRD

<Paste the complete Product Requirements Document (PRD) here, including UI/UX specifications, and the architecture documents>

### Context: Architecture Document

<Paste the complete Architecture Document here>

### Instructions:

1.  **Analyze:** Carefully review the provided PRD and Architecture Document. Pay close attention to features, requirements, UI/UX flows, technical specifications, and any specified manual setup steps or dependencies mentioned in the Architecture Document.
2.  **Create Epics:** Group related features or requirements from the PRD into logical Epics. Aim for roughly 3-6 User Stories per Epic. For each Epic, clearly state its primary goal.
3.  **Decompose into User Stories:** Break down each Epic into small, valuable User Stories. Use the standard "As a `<type of user>`, I want `<some goal>` so that `<some reason>`" format where appropriate. Ensure stories align with the INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable), keeping in mind that foundational/setup stories might have slightly different characteristics but must still be clearly defined.
4.  **Sequence Logically:** This is critical. Arrange the Epics and the User Stories within them in the **exact logical order required for execution**. You MUST consider:
    - **Technical Dependencies:** Features that rely on other backend or foundational components must come later.
    - **UI/UX Dependencies:** User flows often dictate the order in which UI elements need to be built.
    - **Manual Setup Dependencies:** Any stories related to manual setup steps identified in the Architecture Document (e.g., project initialization via CLI) MUST be placed first in the sequence.
    - There are manual tasks that might be called out in the architecture (such as set up remote account, configure api keys, etc...) - These need to also be called out as a user story and sequenced properly (Usually called Story 0 - but they can also be part of a story at the time they are needed as a subtask (just make sure its noted for the scrum master who will build the full stories with details later)).
5.  **Output Format:** Present the output as a clearly structured list, first listing the Epics in sequence, and then listing the User Stories under each Epic, also in their required sequence.

Example Structure:

Epic 1: <Epic Goal>
_ Story 1.1: <User Story Title>
_ Story 1.2: <User Story Title>
_ ...
Epic 2: <Epic Goal>
_ Story 2.1: <User Story Title> \* ...

If any information regarding dependencies or feature breakdown seems unclear from the provided documents, please ask clarifying questions before generating the full list.
