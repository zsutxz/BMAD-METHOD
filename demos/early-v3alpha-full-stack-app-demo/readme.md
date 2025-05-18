# Project 1 Demo

Hacker News AI Podcast NextJS Monorepo

## Full Agile Workflow

## **Providing too much detail about wanting to use facades to wrap things really caused the AI to screw some things up that I did not catch before letting it make a lot of story updates - lesson learned, dont put too much into the technical-preferences as the llm will overuse the hell out of it when updating epics and stories and if unnoticed are a pain to clean up later.**

**The output of this nonsense is apparent in the stories generated haphazardly.**

# Demo Info

- 0-brief.md generated with the Analyst through discussion of an idea. (Gemini 2.5 Pro)
- The end of the brief has the hand off prompt to kick off the PM in PRD create mode.
- 1-prd.md Generated from a great discussion in interactive mode. the prd has some citation noise in it that should not be in the release version.
- The end of the prd has the output from the checklist and also the prompt for the architect.
- Before running the architect I also ran the design-architect in ui-ux-spec mode to produce that doc which give a little more ui focus to fill in some PRD level details about the front end app piece of this.
- I then ran with the PM prompt against the architect - the nice thing about these prompt carry overs is they carry extra details that get discussed in conversation that do not belong in that doc. So for example, when I am talking to the PM, reviewing stories and epics high level - I randomly think of a lot of lower level details - sequencing issues - technology choices - so I might let the PM know - he keeps track of them and if they do not belong in the PRD they go into the prompt.
- Oh - another cool think with the V3 PM - aside from YOLO or not - it also has 2 different styles of producing the high level epics and stories - the way I think they should be high level business outcome focused - but also a mode that assumes going to skip the architect where it will but a lot more technical detail into the story AC. I am not a fan of that mode - and thats a bit how V2 was operating, a little too much at that level for my personal taste - but now its a choice!
- I also create a 0-technical-preferences.md document - this is a new V3 feature that is IMO a game changer. As you build apps, you can keep track of architecture design and coding patterns and practices you favor. If they are in that doc, and they make sense for the project being discussed, the architect can include them or suggest them where they fit. So for example I want a hexagonal architecture I don't have to explain it every time.
- I mentioned a bit too much about facade in an unclear way, and the architect once the whole checklist was run and we went through all the sections, gave me an output of proposed changes - I should have read it a bit closer but was in a hurry to produce the demo content - so when I had the PO apply all the improvements to all stories, a few I had to have corrected, it went a bit facade crazy.
- But I am jumping ahead there - the architect was done in a super helpful interactive mode - talking me through every section of the template!
- I then ran the design architect in generate front end architecture mode - it produced a fully details front end architecture - I am not sure if its overkill for this simple project ui with 2 simple screens, but I wanted to test it out. I need to do some more consulting with front end experts as I am more of a back end engineer these days - but I think it produced a useful document.
- The best part was also having it generate a V0 prompt for me - this takes in the PRD the Architecture, the ui-ux-spec, and the front end architecture and crafts a detailed prompt - much better than could manually be written on the fly by me.
  I put the full prompt into V0 - and I had the full functional UI I envisioned actually working - ready to replace the mode data with real data sources - UNBELIEVABLE! - The prompt is in the file 9-v0-one-shot-prompt.txt - try it out! That was with no tweaks.
- I then had the Po take the arch suggested changes, and front end suggested changes - and the PO gave me a fully updated version of the full PRD (with all the epics and stories corrected in a one shot output) after he confirmed all the changes with me - I should have corrected a few, but was in a hurry and just told him YOLO all the changes LOL
- I think had the PO do the full massive checklist run in a new instance with all of the updated docs to find any issues - which can he seen in the 7-po-checklist-result.md file.

BTW - the original PRD is in file 1-prd - and 8-prd-po-updated is the one with all the inclusions from the other suggestions, plus a few changes fromm the checklist run.

- Once all of this was in cursor - I than used the new doc-sharding-task.md (which is powered by a doc-sharding-template so its easy to modify) - this took the final architecture, final PRD, and final front end architecture - and it output all of the smaller granular files in the folder 10-sharded-docs. The sharing was done with just a normal agent (no rules or mode customization) - this is the nice thing about the task files - don't need custom agent slots being filled up with these seldom used tasks.

- The dev agent and the SM are aligned on usage of these smaller docs, and have been tweaked to produce the stories. Folder 11 has samples of some of the granular stories created - just for fun, I had the POSM in gemini2.5 pro web YOLO all of the detailed stories for the first few epics. I DONT RECOMMEND DOING THIS IN REALITY - you lose the benefit of dev notes from one story if things change or pivot or whatever, feeding into the next story creation right before pick up. But its fun to do this to see how the model is at producing stories, and if the level of story detail is dialed in for a given model.

- For Epic 3 stories - I also YOLOd it, but use Sonnet 3.7 - just to see how the quality of story output differs doing it from within cursor with a very different model.
