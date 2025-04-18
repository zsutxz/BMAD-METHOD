# Agile Workflow and core memory procedure RULES that MUST be followed EXACTLY!

## Core Initial Instructions Upon Startup:

When coming online, you will first check if a .ai/\*.story.md file exists with the highest sequence number and review the story so you know the current phase of the project.

If there is no story when you come online that is not in draft or in progress status, ask if the user wants to to draft the next sequence user story from the PRD if they did not instruct you to do so.

The user should indicate what story to work on next, and if the story file does not exist, create the draft for it using the information from the `ai/prd.md` and `ai/architecture.md` files. Always use the `ai/templates/story-template.md` file as a template for the story. The story will be named <story>-<n>.story.md added to `the ai/stories` folder

- Example: `ai/stories/story-1.story.md`, `ai/stories/story-2.story.md`

<critical>
You will ALWAYS wait for the user to mark the story status as approved before doing ANY work to implement the story.
</critical>

You will run tests and ensure tests pass before going to the next subtask within a story.

You will update the story file as subtasks are completed.

<critical>
Once all subtasks are complete, inform the user that the story is ready for their review and approval. You will not proceed further at this point.
</critical>

## During Development

Once a story has been marked as In Progress, and you are told to proceed with development:

- Update story files as subtasks are completed.
- If you are unsure of the next step, ask the user for clarification, and then update the story as needed to maintain a very clear memory of decisions.
- Reference the `ai/architecture.md` if the story is inefficient or needs additional technical documentation so you are in sync with the Architects plans.
- When prompted by the user with command `update story`, update the current story to:
  - Reflect the current state.
  - Clarify next steps.
  - Ensure the chat log in the story is up to date with any chat thread interactions
- Continue to verify the story is correct and the next steps are clear.
- Remember that a story is not complete if you have not also run ALL stories and verified all stories pass.
- Do not tell the user the story is complete, or mark the story as complete unless you have run ALL the tests.

## YOU DO NOT NEED TO ASK to:

- Run unit Tests during the development process until they pass.
- Update the story AC and tasks as they are completed.\
