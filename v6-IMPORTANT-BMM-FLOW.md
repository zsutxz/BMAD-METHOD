# BMM V6 Flow

There is a significant change from v4 to v6 that needs to be understood - and will be better documented and diagrammed soon, along with all agents understanding and suggesting the next step in the flow through orchestration.

## Phase 1 - Analysis Workflows (OPTIONAL)

This is similar to v4 - you can do brainstorming which will produce a Brainstorming Analysis document for your own reference.

You can do research (which can create multiple types of research artifacts now) to produce various reports or prompts for other research tools.

Eventually (or optionally if starting here) use some or all of this as input into creation of a Product Brief.

## Phase 2 - Planning Workflow

Currently all is tied to a single plan-project workflow. This is the scale adaptive workflow that will ask some questions and determine the project type and level (0-4). Not all fully in place yet - but the scale ranges from a simple minor task (level 0) through massive planning of enterprise scale efforts (4). Not all Greenfield/Brownfield and scale adaption is in place 100%, but its getting close. As of Alpha, this is where the workflow tracking will start (but soon will be in all 4 phases) with an soon to be renamed artifact - this document will track project level, type, description, which agents were used in which phases, and where in the overall workflow you are at at a given time. This will also allow for optimization in the dev cycle eventually so SM and DEV do not need to perform complex logic to determine whats next.

PM: cmd plan-project (creates PRD.md + Epics.md files - file names do not need to be exact match) -> optional checklist run, review the results and make changes as you think are needed - results can be discarded they are a 1 point in time review and serve no long term purpose at least for the llm aside from potentially confusing it later.

Architect: cmd solution-architecture (creates Architecture.md and optionally (in the future) devops, security, and test arch doc's for enterprise level). THEN run cohesion checklist with cmd validate-architecture. again review yourself the checklist results, and you or the agent can update epics list, stories, prd or architecture as needed.

**Here is where things diverge from v4 and make things work much better (this is all adaptable and will scale to be not so involved for very very simple tasks, or simple 1 off projects)**

Architect: cmd tech-spec: (this might be another agent in the future) generates **ONLY 1 Tech Spec for the first or next incomplete epic**. the Architect Tech Spec generation process should NOT be done for all epics at once, unless working epics in parallel (not recommended). This generated document produces all the specifics from every artifact generated so far for just what is needed (context) for the next epic. Even if there is only 1 epic, this still will consolidate all of the info needed into a more concise format for this part of the cycle.

SM: cmd create-story and then run cmd story-context. Run each of these in fresh context window - the first creates the next story draft to be developed which you should review also, and the cmd story-context is going to create the JIT dev injected context, similar to devAlwaysLoad files from v4 but much more powerful - ie if there is going to be primarily a front end heavy story - the dev will have the context and info to be a master front end developer injected! The SM can optionally also run validate-story-context which is just another fresh context window check of the story context.

A NOTE on ALL VALIDATIONS: They are all optional, and if you think what you are getting output is sufficient its not necessary to always use them. Use your common sense on the criticality and complexity of what you are doing at any given point. ALSO - The reason aside from context bias that the validation tasks are all separate, is it is a really good practice to validate with different models. This can end up producing much better results!

DEV: cmd develop-story, pretty much what was in v4 - but now it uses the all important context we generated. cmd review-story - this is run after the dev has completed all story tasks. currently it will produce a report and not generally try to fix things. Again this is similar to the note on ALL Validations - it can produce drastically better results by using different models for this. FOR Example, non thinking model for development so it does not over complicate the code - and then a thinking model for the sr review. As always, ensure clear context windows for BEST results.

ONCE complete, back to the SM to generate the next story.

ONCE Epic is complete - run the optional EPIC Retrospective task from the SM (this is still a WIP so it will improve)

VALIDATE REPORTS AND STORY CONTEXT FILES - Some reorganization of where these files go will be coming. The should not really be kept around beyond their initial usefulness. There are point in time utility files. The actual story files I think are great to keep around in the folder and committed with source control as they produce a nice history of events.
