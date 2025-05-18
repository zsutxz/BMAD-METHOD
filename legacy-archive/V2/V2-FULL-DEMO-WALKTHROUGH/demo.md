# Demonstration of the Full BMad Workflow Agent Gem Usage

**Welcome to the complete end-to-end walkthrough of the BMad Method V2!** This demonstration showcases the power of AI-assisted software development using a phased agent approach. You'll see how each specialized agent (BA, PM, Architect, PO/SM) contributes to the project lifecycle - from initial concept to implementation-ready plans.

Each section includes links to **full Gemini interaction transcripts**, allowing you to witness the remarkable collaborative process between human and AI. The demo folder contains all output artifacts that flow between agents, creating a cohesive development pipeline.

What makes this V2 methodology exceptional is how the agents work in **interactive phases**, pausing at key decision points for your input rather than dumping massive documents at once. This creates a truly collaborative experience where you shape the outcome while the AI handles the heavy lifting.

Follow along from concept to code-ready project plan and see how this workflow transforms software development!

## BA Brainstorming

The following link shows the full chat thread with the BA demonstrating many features of this amazing agent. I started out not even knowing what to build, and it helped me ideate with the goal of something interesting for tutorial purposes, refine it, do some deep research (in thinking mode, I did not switch models), gave some great alternative details and ideas, prompted me section by section eventually to produce the brief. It worked amazingly well. You can read the full transcript and output here:

https://gemini.google.com/share/fec063449737

## PM Brainstorming (Oops it was not the PM LOL)

I took the final output md brief with prompt for the PM at the end of the last chat and created a google doc to make it easier to share with the PM (I could have probably just pasted it into the new chat, but it's easier if I want to start over). In Google Docs it's so easy to just create a new doc, right click and select 'Paste from Markdown', then click in the title and it will automatically name and save it with the title of the document. I then started a chat with the 2-PM Gem, also in Gemini 2.5 Pro thinking mode by attaching the Google doc and telling it to reference the prompt. This is the transcript. I realized that I accidentally had pasted the BA prompt also into the PM prompt, so this actually ended up producing a pretty nicely refined brief 2.0 instead LOL

https://g.co/gemini/share/3e09f04138f2

So I took that output file and put it into the actual BA again to produce a new version with prompt as seen in [this file](final-brief-with-pm-prompt.txt) ([md version](final-brief-with-pm-prompt.md)).

## PM Brainstorming Take 2

I will be going forward with the rest of the process not use Google Docs even though it's preferred and instead attach txt attachments of previous phase documents, this is required or else the link will be un-sharable.

Of note here is how I am not passive in this process and you should not be either - I looked at its proposed epics in its first PRD draft after answering the initial questions and spotting something really dumb, it had a final epic for doing file output and logging all the way at the end - when really this should be happening incrementally with each epic. The Architect or PO I hope would have caught this later and the PM might also if I let it get to the checklist phase, but if you can work with it you will have quicker results and better outcomes.

Also notice, since we came to the PM with the amazing brief + prompt embedded in it - it only had like 1 question before producing the first draft - amazing!!!

The PM did a great job of asking the right questions, and producing the [Draft PRD](prd.txt) ([md version](prd.md)), and each epic, [1](epic1.txt) ([md version](epic1.md)), [2](epic2.txt) ([md version](epic2.md)), [3](epic3.txt) ([md version](epic3.md)), [4](epic4.txt) ([md version](epic4.md)), [5](epic5.txt) ([md version](epic5.md)).

The beauty of these new V2 Agents is they pause for you to answer questions or review the document generation section by section - this is so much better than receiving a massive document dump all at once and trying to take it all in. in between each piece you can ask questions or ask for changes - so easy - so powerful!

After the drafts were done, it then ran the checklist - which is the other big game changer feature of the V2 BMAD Method. Waiting for the output final decision from the checklist run can be exciting haha!

Getting that final PRD & EPIC VALIDATION SUMMARY and seeing it all passing is a great feeling.

[Here is the full chat summary](https://g.co/gemini/share/abbdff18316b).

## Architect (Terrible Architect - already fired and replaced in take 2)

I gave the architect the drafted PRD and epics. I call them all still drafts because the architect or PO could still have some findings or updates - but hopefully not for this very simple project.

I started off the fun with the architect by saying 'the prompt to respond to is in the PRD at the end in a section called 'Initial Architect Prompt' and we are in architecture creation mode - all PRD and epics planned by the PM are attached'

NOTE - The architect just plows through and produces everything at once and runs the checklist - need to improve the gem and agent to be more workflow focused in a future update! Here is the [initial crap it produced](botched-architecture.md) - don't worry I fixed it, it's much better in take 2!

There is one thing that is a pain with both Gemini and ChatGPT - output of markdown with internal markdown or mermaid sections screws up the output formatting where it thinks the start of inner markdown is the end to its total output block - this is because the reality is everything you are seeing in response from the LLM is already markdown, just being rendered by the UI! So the fix is simple - I told it "Since you already default respond in markdown - can you not use markdown blocks and just give the document as standard chat output" - this worked perfect, and nested markdown was properly still wrapped!

I updated the agent at this point to fix this output formatting for all gems and adjusted the architect to progress document by document prompting in between to get clarifications, suggest tradeoffs or what it put in place, etc., and then confirm with me if I like all the draft docs we got 1 by 1 and then confirm I am ready for it to run the checklist assessment. Improved usage of this is shown in the next section Architect Take 2 next.

If you want to see my annoying chat with this lame architect gem that is now much better - [here you go](https://g.co/gemini/share/0a029a45d70b).

{I corrected the interaction model and added YOLO mode to the architect, and tried a fresh start with the improved gem in take 2.}

## Architect Take 2 (Our amazing new architect)

Same initial prompt as before but with the new and improved architect! I submitted that first prompt again and waited in anticipation to see if it would go insane again.

So far success - it confirmed it was not to go all YOLO on me!

Our new architect is SO much better, and also fun '(Pirate voice) Aye, yargs be a fine choice, matey!' - firing the previous architect was a great decision!

It gave us our [tech stack](tech-stack.txt) ([md version](tech-stack.md)) - the tech-stack looks great, it did not produce wishy-washy ambiguous selections like the previous architect would!

I did mention we should call out the specific decisions to not use axios and dotenv so the LLM would not try to use it later. Also I suggested adding Winston and it helped me know it had a better simpler idea for MVP for file logging! Such a great helper now! I really hope I never see that old V1 architect again, I don't think he was at all qualified to even mop the floors.

When I got the [project structure document](project-structure.txt) ([md version](project-structure.md)), I was blown away - you will see in the chat transcript how it was formatted - I was able to copy the whole response put it in an md file and no more issues with sub sections, just removed the text basically saying here is your file! Once confirmed it was md, I changed it to txt for pass off later potentially to the PO.

Here are the remaining docs it did with me one at a time before running the checklist:

- [Architecture](architecture.txt) ([md version](architecture.md)) - the 'Core Workflow / Sequence Diagram (Main Pipeline)' diagram was impressive - one other diagram had a mermaid bugs - I updated the agent and fixed the bugs, these should hopefully not occur again - it was the most common LLM mermaid bug I have gotten across models
- [Data Models](data-models.txt) ([md version](data-models.md)) - another complex file easy to just get the end of message ... copy the response and paste into markdown, perfect result!
- [API Reference](api-reference.txt) ([md version](api-reference.md))
- [Env Vars](environment-vars.txt) ([md version](environment-vars.md))
- [Coding Standards](coding-standards.txt) ([md version](coding-standards.md))
- [Testing Strategy](testing-strategy.txt) ([md version](testing-strategy.md)) - It really nailed this one, even having me ensure it captured by concerns about testing each epic with scripts incrementally - which I did confirm was awesome!

It then confirmed it was done with all the artifacts and ready to assess with its checklist! Here are the results: 5 minor points and great questions - some I answered, one I didn't understand and it explained it to me in detail!

I made the updates, and it also proposed a new file for this project specifically! [Prompts](prompts.txt) ([md version](prompts.md)) - I did have it take the output from that to ensure its referenced where needed including epic 4 and coding standards, it helped me regenerate epic 4 with the changes.

We were done, I told it great job, the output it gave me next was perfect showing the complete function of the multiphased agent! Here is a snippet!

```text
Next Steps:

The project can now move into the implementation phase, using these architecture documents as the blueprint. Development agents can be tasked with implementing the stories within each Epic, following the defined structure, standards, and testing strategy.

As the 3-Architect, I can switch to Mode 3: Master Architect Advisory if you need further assistance during development, such as:

Explaining architectural concepts.
Advising on implementation challenges.
Evaluating potential changes or enhancements.
Helping manage technical debt.
```

Here is the [full massive architecture discussion link](https://g.co/gemini/share/4fedc292e068)!

## PO-SM

This mode is WILD in Gemini 2.5 Pro with its massive 1 million context window - holy crap! It was able to analyze every artifact together - since there is a 10 document attach limit I created a [Combined Artifacts](combined-artifacts-for-posm.txt) ([md version](combined-artifacts-for-posm.md)) which adds all 5 epic files in it.

There was a ton of output running through the checklist - but the amazing part is it considered it all and output this (in better formatted markdown I didn't capture here well). TL;DR of the following - it caught two great finds! It called out that story 1.2 still calls for dotenv which we are not going to use after working with the architect, and also it is looking for a prompts.md that is called out - but I forgot to attach it, so it caught that! So I corrected story 1.2 and we are ready to proceed with development!

VALIDATION SUMMARY
Category Statuses
Category Status Critical Issues

1. Project Setup & Initialization PASS
2. Infrastructure & Deployment Sequencing PASS
3. External Dependencies & Integrations PASS
4. User/Agent Responsibility Delineation PASS
5. Feature Sequencing & Dependencies PASS
6. MVP Scope Alignment PASS
7. Risk Management & Practicality PASS
8. Documentation & Handoff PASS
9. Post-MVP Considerations PASS
   OVERALL PASS No critical deficiencies identified.

Export to Sheets
Critical Deficiencies
None identified.
Recommendations

While not critical, Story 1.2 could explicitly state npm install {dotenv library} rather than just referencing the library name, for absolute clarity, although the plan specifies native Node.js .env support which negates the need for a library [111, 549]. Correction: The plan correctly states native support is used and no external package is needed [549], removing this minor concern. The reference to installing dotenv in Story 1.2 [111-112] seems contradictory to the environment-vars.txt [549] and tech-stack.txt [867] which state native support is used and dotenv is not needed. This should be clarified/corrected in Story 1.2. Update: Reviewing Story 1.2 [111], it does explicitly require installing dotenv, which contradicts ENV [549], ARCH [72], TS [867], and PRD [752] (which implies native support via .env.example). This inconsistency needs resolution. Decision: Assuming ENV, ARCH, TS, PRD are correct and Story 1.2 requirement for dotenv package is an error. Will proceed assuming NO dotenv package required.

Consider adding a docs/prompts.md file explicitly, as referenced in ARCH [89] and E4 Story 4.2 [321], even if prompts are simple initially. Update: E4 Story 4.2 [321-325] does require creating docs/prompts.md and referencing it. This seems sufficient.

Final Decision

APPROVED: The plan is comprehensive, meticulously detailed across PRD, Architecture, Epics, and supporting documents. The sequencing is logical, dependencies are managed, risks acknowledged, and the scope aligns tightly with MVP goals. The technical constraints are respected, and the use of stage testing utilities significantly enhances testability and validation. The identified inconsistency regarding the dotenv package is noted but assumed resolved in favour of native Node.js support based on multiple other document references. The plan is ready for implementation.

Transitioning to SM Mode can proceed upon user confirmation or if auto-proceeding.

(full chat link in the next section)

## PO-SM Story Generation

This is only for demonstration as I do not like to work this way, at this point I want to be into the project - but for fun and testing, I wanted to verify the gem can produce quality stories, potentially multiple at once in case someone were wanting to use this more like taskmaster.

The output looks decent, I still prefer doing this in the IDE with Sonnet 3.5/3.7 though 1 story at a time with the SM, then use the Dev. Mainly because it's still possible you might want to change something story to story - but this is just a preference, and this method of generating all the stories at once might work well for you - experiment and let me know what you find!

- [Story Drafts Epic 1](epic-1-stories-demo.md)
- [Story Drafts Epic 2](epic-2-stories-demo.md)
- [Story Drafts Epic 3](epic-3-stories-demo.md)
  etc...

Here is the full [4-POSM chat record](https://g.co/gemini/share/9ab02d1baa18).

Ill post the link to the video and final project here if you want to see the final results of the app build - but I am beyond extatic at how well this planning workflow is now tuned with V2.

Thanks if you read this far.

- BMad
