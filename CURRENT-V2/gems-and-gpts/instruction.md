# Instructions

## Gemini Gem 2.5

- https://gemini.google.com/gems/view
- Client + New Gem
- Name: I recommend starting with a number or a unique letter as this will be easiest way to identify the gem. For Example 1-Analyst, 2-PM etc...
- Instructions: Paste full content from the specific gem.md file
- Knowledge: Add the specific Text files for the specific agent as listed below - along with other potential instructions you might want to give it. For example - if you know your architect will always follow or should follow a specific stack, you could give it another document for suggested architecture or tech stack to always use, or your patter preferences, and not have to specify every time. But you can also just go with keeping it more generic and use the files from this repo.

### Analyst (BA/RA)

- Instructions: 1-analyst-gem.md pasted into instructions
- Knowledge: templates/project-brief.txt
- During Chat - Mode 1 - 2.5 Pro Deep Research recommended. Mode 2 2.5 Pro Thinking Mode + optional mode 1 deep research attached.
- Message to start with - "hello"

### Product Manager (PM)

- Instructions: 2-pm-gem.md pasted into instructions
- Knowledge: templates/prd.txt, templates/epicN.txt, templates/ui-ux-spec.txt, templates/pm-checklist.txt
- During Chat - Mode 1 - 2.5 Pro Deep Research recommended. Mode 2 2.5 Pro Thinking Mode. Start by also attaching the project brief.
- Message to start with - "please reference and respond to the PM Prompt for us to begin", "there is a prompt for you in the attached file for us to get started so that we can work towards creating the PRD and epics"

### Architect

- Instructions: 3-architect-gem.md pasted into instructions
- Knowledge: templates/architecture-templates.txt, templates/architect-checklist.txt
- During Chat - Mode 1 - 2.5 Pro Deep Research recommended. Mode 2 2.5 Pro Thinking Mode. Start by also attaching the project brief, PRD, and any generated Epic files. If architecture deep research was done as mode 1, attach it to the new chat. Also if there was deep research from the PRD that is not fully distilled in the PRD (deep technical details or solutions), provide to the architect.
- Message to start with - "the prompt to respond to is in the draft-prd at the end in a section called 'Initial Architect Prompt' and we are in architecture creation mode - all prd and epics planned by the pm are attached"

### PO + SM

- Instructions: 4-po-sm-gem.md pasted into instructions
- Knowledge: templates/story-template.txt, templates/po-checklist.txt
- This is optional as a Gem - unlike the workflow within the IDE, using this will generate all remaining stories as one output, instead generating each story when its ready to be worked on through completion. There is ONE main use case for this beyond the obvious generating the artifacts to work on one at a time.
  - The output of this can easily be passed to a new chat with this PO + SM gem or custom GPT and asked to deeply think or analyze through all of the extensive details to spot potential issues gaps, or inconsistences. I have not done this as I prefer to just generate and build 1 story at a time - so the utility of this I have not fully exhausted - but its an interesting idea.
- During chat: Recommend starting chat by providing all possible artifacts output from previous stages - if a file limit is hit, you can attach as a folder in thinking mode for 2.5 pro - or combine documents. The SM needs latest versions of `prd.md`, `architecture.md`, the _technically enriched_ `epicN.md...` files, and relevant reference documents the architecture references, provided after initial PM/Architect collaboration and refinement.
- The IDE version (agents folder) of the SM works on producing 1 story at a time for the dev to work on. This version is a bit different in that it will produce a single document with all remaining stories fully fleshed out at once, which then can be worked on still one on one in the IDE.
- Message to start with - "OK `PO MODE` - ignore from the documents any initial architect prompts instruction sections" followed by "proceed to `SM MODE`. and lets create the stories for epic 1"
