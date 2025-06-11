# Web Build Requirements

## Context

Building web bundles means we will include every file an agent needs in a single file. for a team that means the single file will include all agents in the team and everything they need.

Since multiple files will go into each bundled file, the files will be surrounded by a start and end tag, like:

==================== START: persona#analyst ====================

# Analyst Persona

...

## Section Foo

==================== END: persona#analyst ====================

if a reference is ever given for a path and file and section, such as `bmad-core/personas/analyst#section-foo`, which might also be written as just `personas#analyst#section-foo` that would mean the document is between the previous start and end tag and that final has would be the section also if provided.

When compiling and adding content, for example that analyst block in the original file might refer to `bmad-core/tasks/task-foo.md`, that should be recorded as `tasks#task-foo` and be found somewhere int he document like:

==================== START: tasks#task-foo ====================

# Task Foo

...

==================== END: tasks#task-foo ====================

## Task: Create Build Script for Web Bundles

create a cli nodejs tool with scripts added to package.json so we can easily run with npm run build - this should point to a cli tool in a folder called tools

### Part 1: Build process will produce agent bundles

- [] Need a js build script to create web bundle agents for each individual agent:
  - [] dist/agents - each agent in bmad-code/agents will result in a single file under this folder. This will be a standalone agent file with all resources it needs. The agent yml file lists all resources it needs that either it or something it uses needs. The file needs to start with an instruction to the LLM so that the llm loading the bundle knows it is now the agent, and will follow all instructions, most critically the agent yml `startup` commands - or the startup instructions from the persona file referenced in the agent yml persona field. The initial startup instruction will be the same for every agent bundle, so we should save this as a template in bmad-core templates folder called web-agent-startup-instructions-template.md. Its a simple straight text file that will be copied into each agent header. it should also explain the process for translating file paths to search to find information.
  - [] Then there will be a file marker start break to add the agent file itself as described in the context following the same format. with the same start and end tags. Remember that the start end end tags are always made of of FOLDER#FILE#SECTION - ignoring the parent bmad-core. so a folder will always be one of the folder names under bmad-core (except ide-agents).
  - [] So the first file will be something like agents#pm if this was the file bmad-core/agents/pm.yml
  - [] every file referenced in the agents yaml file must be copied over also following the same pattern

### Part 2: Build Process will produce team of agents bundles

Similar to task one, we need to build bundles for teams. Its the same concept, but scaled to multiple agents. When the build runs, each team specified in the bmad-core/agent-teams folder will result in one single bundle.

- the start of the file will start with an initial instruction similar to task 1
- the first agent will ALWAYS be the bmad agent who is the orchestrator of the team in the web. the
- the key with the team is deduplication files added to the bundle. for example if three agents use the task#foo, it should only be in the bundle once.
