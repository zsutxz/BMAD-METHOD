# Prompt 8: Optional IDE Generate the Granular Stories from a single file of stories

Depending on which LLM and IDE you are using, you might want to split up your stories file if it is too large for the LLM to handle and you are using a lower context model to keep cost down or remain under free usage tiers. This is not a difficult task for LLM and does not require thought or deep research whatsoever.

## Prompt Follows for IDE Agent (Such as Claude 3.5 or 3.7):

Review ./ai-pm/stories.md and without changing ANY content, generate all of the
individual story files to add to ./ai-pm/1-ToDo/. Each story in the file has a title, which will drive the file name. And each story has a separator between each story block. The content for each story block will be the only contents within each file you will create.

Each story block starts with **Story ID:** `<Story_ID>`, the file you will create for that block will be `<Story_ID>`.md.
