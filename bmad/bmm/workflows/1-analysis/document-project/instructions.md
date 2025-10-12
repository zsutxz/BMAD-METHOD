# Document Project Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/document-project/workflow.yaml</critical>
<critical>CSV files are loaded conditionally based on workflow state - NOT all at once</critical>

<step n="0" goal="Check for resumability and load data files only when needed">
<critical>SMART LOADING STRATEGY: Check state file FIRST before loading any CSV files</critical>

<action>Check for existing state file at: {output_folder}/project-scan-report.json</action>

<check if="project-scan-report.json exists">
  <action>Read state file and extract: timestamps, mode, scan_level, current_step, completed_steps, project_classification</action>
  <action>Extract cached project_type_id(s) from state file if present</action>
  <action>Calculate age of state file (current time - last_updated)</action>

<ask>I found an in-progress workflow state from {{last_updated}}.

**Current Progress:**

- Mode: {{mode}}
- Scan Level: {{scan_level}}
- Completed Steps: {{completed_steps_count}}/{{total_steps}}
- Last Step: {{current_step}}
- Project Type(s): {{cached_project_types}}

Would you like to:

1. **Resume from where we left off** - Continue from step {{current_step}}
2. **Start fresh** - Archive old state and begin new scan
3. **Cancel** - Exit without changes

Your choice [1/2/3]:
</ask>

    <check if="user selects 1">
      <action>Set resume_mode = true</action>
      <action>Load findings summaries from state file</action>
      <action>Load cached project_type_id(s) from state file</action>

      <critical>CONDITIONAL CSV LOADING FOR RESUME:</critical>
      <action>For each cached project_type_id, load ONLY the corresponding row from: {documentation_requirements_csv}</action>
      <action>Skip loading project-types.csv and architecture_registry.csv (not needed on resume)</action>
      <action>Store loaded doc requirements for use in remaining steps</action>

      <action>Set current_step = {{resume_point}}</action>
      <action>Display: "Resuming from {{current_step}} with cached project type(s): {{cached_project_types}}"</action>
      <action>Jump to {{current_step}}</action>
    </check>

    <check if="user selects 2">
      <action>Create archive directory: {output_folder}/.archive/</action>
      <action>Move old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json</action>
      <action>Set resume_mode = false</action>
      <action>Continue to Step 0.5</action>
    </check>

    <check if="user selects 3">
      <action>Display: "Exiting workflow without changes."</action>
      <action>Exit workflow</action>
    </check>

  </check>

  <check if="state file age >= 24 hours">
    <action>Display: "Found old state file (>24 hours). Starting fresh scan."</action>
    <action>Archive old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json</action>
    <action>Set resume_mode = false</action>
    <action>Continue to Step 0.5</action>
  </check>

</step>

<step n="0.5" goal="Load CSV data files for fresh starts (not needed for resume)" if="resume_mode == false">
<critical>CSV LOADING STRATEGY - Understanding the Documentation Requirements System:</critical>

<action>Display explanation to user:

**How Project Type Detection Works:**

This workflow uses 3 CSV files to intelligently document your project:

1. **project-types.csv** ({project_types_csv})
   - Contains 12 project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded)
   - Each type has detection_keywords used to identify project type from codebase
   - Used ONLY during initial project classification (Step 1)

2. **documentation-requirements.csv** ({documentation_requirements_csv})
   - 24-column schema that defines what to look for in each project type
   - Columns include: requires_api_scan, requires_data_models, requires_ui_components, etc.
   - Contains file patterns (key_file_patterns, critical_directories, test_file_patterns, etc.)
   - Acts as a "scan guide" - tells the workflow WHERE to look and WHAT to document
   - Example: For project_type_id="web", requires_api_scan=true, so workflow scans api/ folder

3. **architecture-registry.csv** ({architecture_registry_csv})
   - Maps detected tech stacks to architecture templates
   - Used to select appropriate architecture document template
   - Only loaded when generating architecture documentation (Step 8)

**When Each CSV is Loaded:**

- **Fresh Start (initial_scan)**: Load project-types.csv → detect type → load corresponding doc requirements row
- **Resume**: Load ONLY the doc requirements row(s) for cached project_type_id(s)
- **Full Rescan**: Same as fresh start (may re-detect project type)
- **Deep Dive**: Load ONLY doc requirements for the part being deep-dived
  </action>

<action>Now loading CSV files for fresh start...</action>
<action>Load project-types.csv from: {project_types_csv}</action>
<action>Store all 12 project types with their detection_keywords for use in Step 1</action>
<action>Display: "Loaded 12 project type definitions"</action>

<action>Load documentation-requirements.csv from: {documentation_requirements_csv}</action>
<action>Store all rows indexed by project_type_id for later lookup</action>
<action>Display: "Loaded documentation requirements for 12 project types"</action>

<action>Load architecture-registry.csv from: {architecture_registry_csv}</action>
<action>Store architecture templates for later matching in Step 3</action>
<action>Display: "Loaded architecture template registry"</action>

<action>Display: "✓ CSV data files loaded successfully. Ready to begin project analysis."</action>
</step>

<step n="0.6" goal="Check for existing documentation and determine workflow mode">
<action>Check if {output_folder}/index.md exists</action>

<check if="index.md exists">
  <action>Read existing index.md to extract metadata (date, project structure, parts count)</action>
  <action>Store as {{existing_doc_date}}, {{existing_structure}}</action>

<ask>I found existing documentation generated on {{existing_doc_date}}.

What would you like to do?

1. **Re-scan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate detailed documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation as-is

Your choice [1/2/3]:
</ask>

  <check if="user selects 1">
    <action>Set workflow_mode = "full_rescan"</action>
    <action>Continue to scan level selection below</action>
  </check>

  <check if="user selects 2">
    <action>Set workflow_mode = "deep_dive"</action>
    <action>Set scan_level = "exhaustive"</action>
    <action>Initialize state file with mode=deep_dive, scan_level=exhaustive</action>
    <action>Jump to Step 13</action>
  </check>

  <check if="user selects 3">
    <action>Display message: "Keeping existing documentation. Exiting workflow."</action>
    <action>Exit workflow</action>
  </check>
</check>

<check if="index.md does not exist">
  <action>Set workflow_mode = "initial_scan"</action>
  <action>Continue to scan level selection below</action>
</check>

<action if="workflow_mode != deep_dive">Select Scan Level</action>

<check if="workflow_mode == initial_scan OR workflow_mode == full_rescan">
  <ask>Choose your scan depth level:

**1. Quick Scan** (2-5 minutes) [DEFAULT]

- Pattern-based analysis without reading source files
- Scans: Config files, package manifests, directory structure
- Best for: Quick project overview, initial understanding
- File reading: Minimal (configs, README, package.json, etc.)

**2. Deep Scan** (10-30 minutes)

- Reads files in critical directories based on project type
- Scans: All critical paths from documentation requirements
- Best for: Comprehensive documentation for brownfield PRD
- File reading: Selective (key files in critical directories)

**3. Exhaustive Scan** (30-120 minutes)

- Reads ALL source files in project
- Scans: Every source file (excludes node_modules, dist, build)
- Best for: Complete analysis, migration planning, detailed audit
- File reading: Complete (all source files)

Your choice [1/2/3] (default: 1):
</ask>

  <action if="user selects 1 OR user presses enter">
    <action>Set scan_level = "quick"</action>
    <action>Display: "Using Quick Scan (pattern-based, no source file reading)"</action>
  </action>

  <action if="user selects 2">
    <action>Set scan_level = "deep"</action>
    <action>Display: "Using Deep Scan (reading critical files per project type)"</action>
  </action>

  <action if="user selects 3">
    <action>Set scan_level = "exhaustive"</action>
    <action>Display: "Using Exhaustive Scan (reading all source files)"</action>
  </action>

<action>Initialize state file: {output_folder}/project-scan-report.json</action>
<critical>Every time you touch the state file, record: step id, human-readable summary (what you actually did), precise timestamp, and any outputs written. Vague phrases are unacceptable.</critical>
<action>Write initial state:
{
"workflow_version": "1.2.0",
"timestamps": {"started": "{{current_timestamp}}", "last_updated": "{{current_timestamp}}"},
"mode": "{{workflow_mode}}",
"scan_level": "{{scan_level}}",
"project_root": "{{project_root_path}}",
"output_folder": "{{output_folder}}",
"completed_steps": [],
"current_step": "step_1",
"findings": {},
"outputs_generated": ["project-scan-report.json"],
"resume_instructions": "Starting from step 1"
}
</action>
<action>Continue with standard workflow from Step 1</action>
</check>
</step>

<step n="1" goal="Detect project structure and classify project type" if="workflow_mode != deep_dive">
<action>Ask user: "What is the root directory of the project to document?" (default: current working directory)</action>
<action>Store as {{project_root_path}}</action>

<action>Scan {{project_root_path}} for key indicators:

- Directory structure (presence of client/, server/, api/, src/, app/, etc.)
- Key files (package.json, go.mod, requirements.txt, etc.)
- Technology markers matching detection_keywords from project-types.csv
  </action>

<action>Detect if project is:

- **Monolith**: Single cohesive codebase
- **Monorepo**: Multiple parts in one repository
- **Multi-part**: Separate client/server or similar architecture
  </action>

<check if="multiple distinct parts detected (e.g., client/ and server/ folders)">
  <action>List detected parts with their paths</action>
  <ask>I detected multiple parts in this project:
  {{detected_parts_list}}

Is this correct? Should I document each part separately? [y/n]
</ask>

<action if="user confirms">Set repository_type = "monorepo" or "multi-part"</action>
<action if="user confirms">For each detected part: - Identify root path - Run project type detection against project-types.csv - Store as part in project_parts array
</action>

<action if="user denies or corrects">Ask user to specify correct parts and their paths</action>
</check>

<check if="single cohesive project detected">
  <action>Set repository_type = "monolith"</action>
  <action>Create single part in project_parts array with root_path = {{project_root_path}}</action>
  <action>Run project type detection against project-types.csv</action>
</check>

<action>For each part, match detected technologies and keywords against project-types.csv</action>
<action>Assign project_type_id to each part</action>
<action>Load corresponding documentation_requirements row for each part</action>

<ask>I've classified this project:
{{project_classification_summary}}

Does this look correct? [y/n/edit]
</ask>

<template-output>project_structure</template-output>
<template-output>project_parts_metadata</template-output>

<action>IMMEDIATELY update state file with step completion:

- Add to completed_steps: {"step": "step_1", "status": "completed", "timestamp": "{{now}}", "summary": "Classified as {{repository_type}} with {{parts_count}} parts"}
- Update current_step = "step_2"
- Update findings.project_classification with high-level summary only
- **CACHE project_type_id(s)**: Add project_types array: [{"part_id": "{{part_id}}", "project_type_id": "{{project_type_id}}", "display_name": "{{display_name}}"}]
- This cached data prevents reloading all CSV files on resume - we can load just the needed documentation_requirements row(s)
- Update last_updated timestamp
- Write state file
  </action>

<action>PURGE detailed scan results from memory, keep only summary: "{{repository_type}}, {{parts_count}} parts, {{primary_tech}}"</action>
</step>

<step n="2" goal="Discover existing documentation and gather user context" if="workflow_mode != deep_dive">
<action>For each part, scan for existing documentation using patterns:
- README.md, README.rst, README.txt
- CONTRIBUTING.md, CONTRIBUTING.rst
- ARCHITECTURE.md, ARCHITECTURE.txt, docs/architecture/
- DEPLOYMENT.md, DEPLOY.md, docs/deployment/
- API.md, docs/api/
- Any files in docs/, documentation/, .github/ folders
</action>

<action>Create inventory of existing_docs with:

- File path
- File type (readme, architecture, api, etc.)
- Which part it belongs to (if multi-part)
  </action>

<ask>I found these existing documentation files:
{{existing_docs_list}}

Are there any other important documents or key areas I should focus on while analyzing this project? [Provide paths or guidance, or type 'none']
</ask>

<action>Store user guidance as {{user_context}}</action>

<template-output>existing_documentation_inventory</template-output>
<template-output>user_provided_context</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_2", "status": "completed", "timestamp": "{{now}}", "summary": "Found {{existing_docs_count}} existing docs"}
- Update current_step = "step_3"
- Update last_updated timestamp
  </action>

<action>PURGE detailed doc contents from memory, keep only: "{{existing_docs_count}} docs found"</action>
</step>

<step n="3" goal="Analyze technology stack for each part" if="workflow_mode != deep_dive">
<action>For each part in project_parts:
  - Load key_file_patterns from documentation_requirements
  - Scan part root for these patterns
  - Parse technology manifest files (package.json, go.mod, requirements.txt, etc.)
  - Extract: framework, language, version, database, dependencies
  - Build technology_table with columns: Category, Technology, Version, Justification
</action>

<action>Match detected tech stack against architecture_registry_csv:

- Use project_type_id + languages + architecture_style tags
- Find closest matching architecture template
- Store as {{architecture_match}} for each part
  </action>

<template-output>technology_stack</template-output>
<template-output>architecture_template_matches</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_3", "status": "completed", "timestamp": "{{now}}", "summary": "Tech stack: {{primary_framework}}"}
- Update current_step = "step_4"
- Update findings.technology_stack with summary per part
- Update last_updated timestamp
  </action>

<action>PURGE detailed tech analysis from memory, keep only: "{{framework}} on {{language}}"</action>
</step>

<step n="4" goal="Perform conditional analysis based on project type requirements" if="workflow_mode != deep_dive">

<critical>BATCHING STRATEGY FOR DEEP/EXHAUSTIVE SCANS</critical>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>This step requires file reading. Apply batching strategy:</action>

<action>Identify subfolders to process based on: - scan_level == "deep": Use critical_directories from documentation_requirements - scan_level == "exhaustive": Get ALL subfolders recursively (excluding node_modules, .git, dist, build, coverage)
</action>

<action>For each subfolder to scan: 1. Read all files in subfolder (consider file size - use judgment for files >5000 LOC) 2. Extract required information based on conditional flags below 3. IMMEDIATELY write findings to appropriate output file 4. Validate written document (section-level validation) 5. Update state file with batch completion 6. PURGE detailed findings from context, keep only 1-2 sentence summary 7. Move to next subfolder
</action>

<action>Track batches in state file:
findings.batches_completed: [
{"path": "{{subfolder_path}}", "files_scanned": {{count}}, "summary": "{{brief_summary}}"}
]
</action>
</check>

<check if="scan_level == quick">
  <action>Use pattern matching only - do NOT read source files</action>
  <action>Use glob/grep to identify file locations and patterns</action>
  <action>Extract information from filenames, directory structure, and config files only</action>
</check>

<action>For each part, check documentation_requirements boolean flags and execute corresponding scans:</action>

<check if="requires_api_scan == true">
  <action>Scan for API routes and endpoints using integration_scan_patterns</action>
  <action>Look for: controllers/, routes/, api/, handlers/, endpoints/</action>

  <check if="scan_level == quick">
    <action>Use glob to find route files, extract patterns from filenames and folder structure</action>
  </check>

  <check if="scan_level == deep OR scan_level == exhaustive">
    <action>Read files in batches (one subfolder at a time)</action>
    <action>Extract: HTTP methods, paths, request/response types from actual code</action>
  </check>

<action>Build API contracts catalog</action>
<action>IMMEDIATELY write to: {output*folder}/api-contracts-{part_id}.md</action>
<action>Validate document has all required sections</action>
<action>Update state file with output generated</action>
<action>PURGE detailed API data, keep only: "{{api_count}} endpoints documented"</action>
<template-output>api_contracts*{part_id}</template-output>
</check>

<check if="requires_data_models == true">
  <action>Scan for data models using schema_migration_patterns</action>
  <action>Look for: models/, schemas/, entities/, migrations/, prisma/, ORM configs</action>

  <check if="scan_level == quick">
    <action>Identify schema files via glob, parse migration file names for table discovery</action>
  </check>

  <check if="scan_level == deep OR scan_level == exhaustive">
    <action>Read model files in batches (one subfolder at a time)</action>
    <action>Extract: table names, fields, relationships, constraints from actual code</action>
  </check>

<action>Build database schema documentation</action>
<action>IMMEDIATELY write to: {output*folder}/data-models-{part_id}.md</action>
<action>Validate document completeness</action>
<action>Update state file with output generated</action>
<action>PURGE detailed schema data, keep only: "{{table_count}} tables documented"</action>
<template-output>data_models*{part_id}</template-output>
</check>

<check if="requires_state_management == true">
  <action>Analyze state management patterns</action>
  <action>Look for: Redux, Context API, MobX, Vuex, Pinia, Provider patterns</action>
  <action>Identify: stores, reducers, actions, state structure</action>
  <template-output>state_management_patterns_{part_id}</template-output>
</check>

<check if="requires_ui_components == true">
  <action>Inventory UI component library</action>
  <action>Scan: components/, ui/, widgets/, views/ folders</action>
  <action>Categorize: Layout, Form, Display, Navigation, etc.</action>
  <action>Identify: Design system, component patterns, reusable elements</action>
  <template-output>ui_component_inventory_{part_id}</template-output>
</check>

<check if="requires_hardware_docs == true">
  <action>Look for hardware schematics using hardware_interface_patterns</action>
  <ask>This appears to be an embedded/hardware project. Do you have:
  - Pinout diagrams
  - Hardware schematics
  - PCB layouts
  - Hardware documentation

If yes, please provide paths or links. [Provide paths or type 'none']
</ask>
<action>Store hardware docs references</action>
<template-output>hardware*documentation*{part_id}</template-output>
</check>

<check if="requires_asset_inventory == true">
  <action>Scan and catalog assets using asset_patterns</action>
  <action>Categorize by: Images, Audio, 3D Models, Sprites, Textures, etc.</action>
  <action>Calculate: Total size, file counts, formats used</action>
  <template-output>asset_inventory_{part_id}</template-output>
</check>

<action>Scan for additional patterns based on doc requirements:

- config_patterns → Configuration management
- auth_security_patterns → Authentication/authorization approach
- entry_point_patterns → Application entry points and bootstrap
- shared_code_patterns → Shared libraries and utilities
- async_event_patterns → Event-driven architecture
- ci_cd_patterns → CI/CD pipeline details
- localization_patterns → i18n/l10n support
  </action>

<action>Apply scan_level strategy to each pattern scan (quick=glob only, deep/exhaustive=read files)</action>

<template-output>comprehensive*analysis*{part_id}</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_4", "status": "completed", "timestamp": "{{now}}", "summary": "Conditional analysis complete, {{files_generated}} files written"}
- Update current_step = "step_5"
- Update last_updated timestamp
- List all outputs_generated
  </action>

<action>PURGE all detailed scan results from context. Keep only summaries:

- "APIs: {{api_count}} endpoints"
- "Data: {{table_count}} tables"
- "Components: {{component_count}} components"
  </action>
  </step>

<step n="5" goal="Generate source tree analysis with annotations" if="workflow_mode != deep_dive">
<action>For each part, generate complete directory tree using critical_directories from doc requirements</action>

<action>Annotate the tree with:

- Purpose of each critical directory
- Entry points marked
- Key file locations highlighted
- Integration points noted (for multi-part projects)
  </action>

<action if="multi-part project">Show how parts are organized and where they interface</action>

<action>Create formatted source tree with descriptions:

```
project-root/
├── client/          # React frontend (Part: client)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-based pages
│   │   └── api/         # API client layer → Calls server/
├── server/          # Express API backend (Part: api)
│   ├── src/
│   │   ├── routes/      # REST API endpoints
│   │   ├── models/      # Database models
│   │   └── services/    # Business logic
```

</action>

<template-output>source_tree_analysis</template-output>
<template-output>critical_folders_summary</template-output>

<action>IMMEDIATELY write source-tree-analysis.md to disk</action>
<action>Validate document structure</action>
<action>Update state file:

- Add to completed_steps: {"step": "step_5", "status": "completed", "timestamp": "{{now}}", "summary": "Source tree documented"}
- Update current_step = "step_6"
- Add output: "source-tree-analysis.md"
  </action>
  <action>PURGE detailed tree from context, keep only: "Source tree with {{folder_count}} critical folders"</action>
  </step>

<step n="6" goal="Extract development and operational information" if="workflow_mode != deep_dive">
<action>Scan for development setup using key_file_patterns and existing docs:
- Prerequisites (Node version, Python version, etc.)
- Installation steps (npm install, etc.)
- Environment setup (.env files, config)
- Build commands (npm run build, make, etc.)
- Run commands (npm start, go run, etc.)
- Test commands using test_file_patterns
</action>

<action>Look for deployment configuration using ci_cd_patterns:

- Dockerfile, docker-compose.yml
- Kubernetes configs (k8s/, helm/)
- CI/CD pipelines (.github/workflows/, .gitlab-ci.yml)
- Deployment scripts
- Infrastructure as Code (terraform/, pulumi/)
  </action>

<action if="CONTRIBUTING.md or similar found">
  <action>Extract contribution guidelines:
    - Code style rules
    - PR process
    - Commit conventions
    - Testing requirements
  </action>
</action>

<template-output>development_instructions</template-output>
<template-output>deployment_configuration</template-output>
<template-output>contribution_guidelines</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_6", "status": "completed", "timestamp": "{{now}}", "summary": "Dev/deployment guides written"}
- Update current_step = "step_7"
- Add generated outputs to list
  </action>
  <action>PURGE detailed instructions, keep only: "Dev setup and deployment documented"</action>
  </step>

<step n="7" goal="Detect multi-part integration architecture" if="workflow_mode != deep_dive and project has multiple parts">
<action>Analyze how parts communicate:
- Scan integration_scan_patterns across parts
- Identify: REST calls, GraphQL queries, gRPC, message queues, shared databases
- Document: API contracts between parts, data flow, authentication flow
</action>

<action>Create integration_points array with:

- from: source part
- to: target part
- type: REST API, GraphQL, gRPC, Event Bus, etc.
- details: Endpoints, protocols, data formats
  </action>

<action>IMMEDIATELY write integration-architecture.md to disk</action>
<action>Validate document completeness</action>

<template-output>integration_architecture</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_7", "status": "completed", "timestamp": "{{now}}", "summary": "Integration architecture documented"}
- Update current_step = "step_8"
  </action>
  <action>PURGE integration details, keep only: "{{integration_count}} integration points"</action>
  </step>

<step n="8" goal="Generate architecture documentation for each part" if="workflow_mode != deep_dive">
<action>For each part in project_parts:
  - Use matched architecture template from Step 3 as base structure
  - Fill in all sections with discovered information:
    * Executive Summary
    * Technology Stack (from Step 3)
    * Architecture Pattern (from registry match)
    * Data Architecture (from Step 4 data models scan)
    * API Design (from Step 4 API scan if applicable)
    * Component Overview (from Step 4 component scan if applicable)
    * Source Tree (from Step 5)
    * Development Workflow (from Step 6)
    * Deployment Architecture (from Step 6)
    * Testing Strategy (from test patterns)
</action>

<action if="single part project">
  - Generate: architecture.md (no part suffix)
</action>

<action if="multi-part project">
  - Generate: architecture-{part_id}.md for each part
</action>

<action>For each architecture file generated:

- IMMEDIATELY write architecture file to disk
- Validate against architecture template schema
- Update state file with output
- PURGE detailed architecture from context, keep only: "Architecture for {{part_id}} written"
  </action>

<template-output>architecture_document</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_8", "status": "completed", "timestamp": "{{now}}", "summary": "Architecture docs written for {{parts_count}} parts"}
- Update current_step = "step_9"
  </action>
  </step>

<step n="9" goal="Generate supporting documentation files" if="workflow_mode != deep_dive">
<action>Generate project-overview.md with:
- Project name and purpose (from README or user input)
- Executive summary
- Tech stack summary table
- Architecture type classification
- Repository structure (monolith/monorepo/multi-part)
- Links to detailed docs
</action>

<action>Generate source-tree-analysis.md with:

- Full annotated directory tree from Step 5
- Critical folders explained
- Entry points documented
- Multi-part structure (if applicable)
  </action>

<action>IMMEDIATELY write project-overview.md to disk</action>
<action>Validate document sections</action>

<action>Generate source-tree-analysis.md (if not already written in Step 5)</action>
<action>IMMEDIATELY write to disk and validate</action>

<action>Generate component-inventory.md (or per-part versions) with:

- All discovered components from Step 4
- Categorized by type
- Reusable vs specific components
- Design system elements (if found)
  </action>
  <action>IMMEDIATELY write each component inventory to disk and validate</action>

<action>Generate development-guide.md (or per-part versions) with:

- Prerequisites and dependencies
- Environment setup instructions
- Local development commands
- Build process
- Testing approach and commands
- Common development tasks
  </action>
  <action>IMMEDIATELY write each development guide to disk and validate</action>

<action if="deployment configuration found">
  <action>Generate deployment-guide.md with:
    - Infrastructure requirements
    - Deployment process
    - Environment configuration
    - CI/CD pipeline details
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="contribution guidelines found">
  <action>Generate contribution-guide.md with:
    - Code style and conventions
    - PR process
    - Testing requirements
    - Documentation standards
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="API contracts documented">
  <action>Generate api-contracts.md (or per-part) with:
    - All API endpoints
    - Request/response schemas
    - Authentication requirements
    - Example requests
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="Data models documented">
  <action>Generate data-models.md (or per-part) with:
    - Database schema
    - Table relationships
    - Data models and entities
    - Migration strategy
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="multi-part project">
  <action>Generate integration-architecture.md with:
    - How parts communicate
    - Integration points diagram/description
    - Data flow between parts
    - Shared dependencies
  </action>
  <action>IMMEDIATELY write to disk and validate</action>

<action>Generate project-parts.json metadata file:
`json
    {
      "repository_type": "monorepo",
      "parts": [ ... ],
      "integration_points": [ ... ]
    }
    `
</action>
<action>IMMEDIATELY write to disk</action>
</action>

<template-output>supporting_documentation</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_9", "status": "completed", "timestamp": "{{now}}", "summary": "All supporting docs written"}
- Update current_step = "step_10"
- List all newly generated outputs
  </action>

<action>PURGE all document contents from context, keep only list of files generated</action>
</step>

<step n="10" goal="Generate master index as primary AI retrieval source" if="workflow_mode != deep_dive">
<action>Create index.md with intelligent navigation based on project structure</action>

<action if="single part project">
  <action>Generate simple index with:
    - Project name and type
    - Quick reference (tech stack, architecture type)
    - Links to all generated docs
    - Links to discovered existing docs
    - Getting started section
  </action>
</action>

<action if="multi-part project">
  <action>Generate comprehensive index with:
    - Project overview and structure summary
    - Part-based navigation section
    - Quick reference by part
    - Cross-part integration links
    - Links to all generated and existing docs
    - Getting started per part
  </action>
</action>

<action>Include in index.md:

## Project Documentation Index

### Project Overview

- **Type:** {{repository_type}} {{#if multi-part}}with {{parts.length}} parts{{/if}}
- **Primary Language:** {{primary_language}}
- **Architecture:** {{architecture_type}}

### Quick Reference

{{#if single_part}}

- **Tech Stack:** {{tech_stack_summary}}
- **Entry Point:** {{entry_point}}
- **Architecture Pattern:** {{architecture_pattern}}
  {{else}}
  {{#each parts}}

#### {{part_name}} ({{part_id}})

- **Type:** {{project_type}}
- **Tech Stack:** {{tech_stack}}
- **Root:** {{root_path}}
  {{/each}}
  {{/if}}

### Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture{{#if multi-part}}-{part_id}{{/if}}.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory{{#if multi-part}}-{part_id}{{/if}}.md)
- [Development Guide](./development-guide{{#if multi-part}}-{part_id}{{/if}}.md)
  {{#if deployment_found}}- [Deployment Guide](./deployment-guide.md){{/if}}
  {{#if contribution_found}}- [Contribution Guide](./contribution-guide.md){{/if}}
  {{#if api_documented}}- [API Contracts](./api-contracts{{#if multi-part}}-{part_id}{{/if}}.md){{/if}}
  {{#if data_models_documented}}- [Data Models](./data-models{{#if multi-part}}-{part_id}{{/if}}.md){{/if}}
  {{#if multi-part}}- [Integration Architecture](./integration-architecture.md){{/if}}

### Existing Documentation

{{#each existing_docs}}

- [{{title}}]({{relative_path}}) - {{description}}
  {{/each}}

### Getting Started

{{getting_started_instructions}}
</action>

<action>IMMEDIATELY write index.md to disk</action>
<action>Validate index has all required sections and links are valid</action>

<template-output>index</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_10", "status": "completed", "timestamp": "{{now}}", "summary": "Master index generated"}
- Update current_step = "step_11"
- Add output: "index.md"
  </action>

<action>PURGE index content from context</action>
</step>

<step n="11" goal="Validate and review generated documentation" if="workflow_mode != deep_dive">
<action>Show summary of all generated files:
Generated in {{output_folder}}/:
{{file_list_with_sizes}}
</action>

<action>Run validation checklist from {validation}</action>

<ask>Documentation generation complete!

Summary:

- Project Type: {{project_type_summary}}
- Parts Documented: {{parts_count}}
- Files Generated: {{files_count}}
- Total Lines: {{total_lines}}

Would you like to:

1. Review any specific section [type section name]
2. Add more detail to any area [type area name]
3. Generate additional documentation [describe what]
4. Finalize and complete [type 'done']

Your choice:
</ask>

<action if="user requests changes">Make requested modifications and regenerate affected files</action>
<action if="user types 'done'">Proceed to completion</action>

<action>Update state file:

- Add to completed_steps: {"step": "step_11", "status": "completed", "timestamp": "{{now}}", "summary": "Validation complete"}
- Update current_step = "step_12"
  </action>
  </step>

<step n="12" goal="Finalize and provide next steps" if="workflow_mode != deep_dive">
<action>Create final summary report</action>
<action>Compile verification recap variables:
  - Set {{verification_summary}} to the concrete tests, validations, or scripts you executed (or "none run").
  - Set {{open_risks}} to any remaining risks or TODO follow-ups (or "none").
  - Set {{next_checks}} to recommended actions before merging/deploying (or "none").
</action>

<action>Display completion message:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Project Documentation Complete! ✓

**Location:** {{output_folder}}/

**Master Index:** {{output_folder}}/index.md
👆 This is your primary entry point for AI-assisted development

**Generated Documentation:**
{{generated_files_list}}

**Next Steps:**

1. Review the index.md to familiarize yourself with the documentation structure
2. When creating a brownfield PRD, point the PRD workflow to: {{output_folder}}/index.md
3. For UI-only features: Reference {{output_folder}}/architecture-{{ui_part_id}}.md
4. For API-only features: Reference {{output_folder}}/architecture-{{api_part_id}}.md
5. For full-stack features: Reference both part architectures + integration-architecture.md

**Verification Recap:**

- Tests/extractions executed: {{verification_summary}}
- Outstanding risks or follow-ups: {{open_risks}}
- Recommended next checks before PR: {{next_checks}}

**Brownfield PRD Command:**
When ready to plan new features, run the PRD workflow and provide this index as input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>FINALIZE state file:

- Add to completed_steps: {"step": "step_12", "status": "completed", "timestamp": "{{now}}", "summary": "Workflow complete"}
- Update timestamps.completed = "{{now}}"
- Update current_step = "completed"
- Write final state file
  </action>

<action>Display: "State file saved: {{output_folder}}/project-scan-report.json"</action>
</step>

<step n="13" goal="Deep-dive documentation of specific area" if="workflow_mode == deep_dive">
<critical>Deep-dive mode requires literal full-file review. Sampling, guessing, or relying solely on tooling output is FORBIDDEN.</critical>
<action>Load existing project structure from index.md and project-parts.json (if exists)</action>
<action>Load source tree analysis to understand available areas</action>

<step n="13a" goal="Identify area for deep-dive">
  <action>Analyze existing documentation to suggest deep-dive options</action>

<ask>What area would you like to deep-dive into?

**Suggested Areas Based on Project Structure:**

{{#if has_api_routes}}

### API Routes ({{api_route_count}} endpoints found)

{{#each api_route_groups}}
{{group_index}}. {{group_name}} - {{endpoint_count}} endpoints in `{{path}}`
{{/each}}
{{/if}}

{{#if has_feature_modules}}

### Feature Modules ({{feature_count}} features)

{{#each feature_modules}}
{{module_index}}. {{module_name}} - {{file_count}} files in `{{path}}`
{{/each}}
{{/if}}

{{#if has_ui_components}}

### UI Component Areas

{{#each component_groups}}
{{group_index}}. {{group_name}} - {{component_count}} components in `{{path}}`
{{/each}}
{{/if}}

{{#if has_services}}

### Services/Business Logic

{{#each service_groups}}
{{service_index}}. {{service_name}} - `{{path}}`
{{/each}}
{{/if}}

**Or specify custom:**

- Folder path (e.g., "client/src/features/dashboard")
- File path (e.g., "server/src/api/users.ts")
- Feature name (e.g., "authentication system")

Enter your choice (number or custom path):
</ask>

<action>Parse user input to determine: - target_type: "folder" | "file" | "feature" | "api_group" | "component_group" - target_path: Absolute path to scan - target_name: Human-readable name for documentation - target_scope: List of all files to analyze
</action>

<action>Store as {{deep_dive_target}}</action>

<action>Display confirmation:
Target: {{target_name}}
Type: {{target_type}}
Path: {{target_path}}
Estimated files to analyze: {{estimated_file_count}}

This will read EVERY file in this area. Proceed? [y/n]
</action>

<action if="user confirms 'n'">Return to Step 13a (select different area)</action>
</step>

<step n="13b" goal="Comprehensive exhaustive scan of target area">
  <action>Set scan_mode = "exhaustive"</action>
  <action>Initialize file_inventory = []</action>
  <critical>You must read every line of every file in scope and capture a plain-language explanation (what the file does, side effects, why it matters) that future developer agents can act on. No shortcuts.</critical>

  <check if="target_type == folder">
    <action>Get complete recursive file list from {{target_path}}</action>
    <action>Filter out: node_modules/, .git/, dist/, build/, coverage/, *.min.js, *.map</action>
    <action>For EVERY remaining file in folder:
      - Read complete file contents (all lines)
      - Extract all exports (functions, classes, types, interfaces, constants)
      - Extract all imports (dependencies)
      - Identify purpose from comments and code structure
      - Write 1-2 sentences (minimum) in natural language describing behaviour, side effects, assumptions, and anything a developer must know before modifying the file
      - Extract function signatures with parameter types and return types
      - Note any TODOs, FIXMEs, or comments
      - Identify patterns (hooks, components, services, controllers, etc.)
      - Capture per-file contributor guidance: `contributor_note`, `risks`, `verification_steps`, `suggested_tests`
      - Store in file_inventory
    </action>
  </check>

  <check if="target_type == file">
    <action>Read complete file at {{target_path}}</action>
    <action>Extract all information as above</action>
    <action>Read all files it imports (follow import chain 1 level deep)</action>
    <action>Find all files that import this file (dependents via grep)</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == api_group">
    <action>Identify all route/controller files in API group</action>
    <action>Read all route handlers completely</action>
    <action>Read associated middleware, controllers, services</action>
    <action>Read data models and schemas used</action>
    <action>Extract complete request/response schemas</action>
    <action>Document authentication and authorization requirements</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == feature">
    <action>Search codebase for all files related to feature name</action>
    <action>Include: UI components, API endpoints, models, services, tests</action>
    <action>Read each file completely</action>
    <action>Store all in file_inventory</action>
  </check>

  <check if="target_type == component_group">
    <action>Get all component files in group</action>
    <action>Read each component completely</action>
    <action>Extract: Props interfaces, hooks used, child components, state management</action>
    <action>Store all in file_inventory</action>
  </check>

<action>For each file in file\*inventory, document: - **File Path:** Full path - **Purpose:** What this file does (1-2 sentences) - **Lines of Code:** Total LOC - **Exports:** Complete list with signatures

- Functions: `functionName(param: Type): ReturnType` - Description
  _ Classes: `ClassName` - Description with key methods
  _ Types/Interfaces: `TypeName` - Description
  \_ Constants: `CONSTANT_NAME: Type` - Description - **Imports/Dependencies:** What it uses and why - **Used By:** Files that import this (dependents) - **Key Implementation Details:** Important logic, algorithms, patterns - **State Management:** If applicable (Redux, Context, local state) - **Side Effects:** API calls, database queries, file I/O, external services - **Error Handling:** Try/catch blocks, error boundaries, validation - **Testing:** Associated test files and coverage - **Comments/TODOs:** Any inline documentation or planned work
  </action>

<template-output>comprehensive_file_inventory</template-output>
</step>

<step n="13c" goal="Analyze relationships and data flow">
  <action>Build dependency graph for scanned area:
    - Create graph with files as nodes
    - Add edges for import relationships
    - Identify circular dependencies if any
    - Find entry points (files not imported by others in scope)
    - Find leaf nodes (files that don't import others in scope)
  </action>

<action>Trace data flow through the system: - Follow function calls and data transformations - Track API calls and their responses - Document state updates and propagation - Map database queries and mutations
</action>

<action>Identify integration points: - External APIs consumed - Internal APIs/services called - Shared state accessed - Events published/subscribed - Database tables accessed
</action>

<template-output>dependency_graph</template-output>
<template-output>data_flow_analysis</template-output>
<template-output>integration_points</template-output>
</step>

<step n="13d" goal="Find related code and similar patterns">
  <action>Search codebase OUTSIDE scanned area for:
    - Similar file/folder naming patterns
    - Similar function signatures
    - Similar component structures
    - Similar API patterns
    - Reusable utilities that could be used
  </action>

<action>Identify code reuse opportunities: - Shared utilities available - Design patterns used elsewhere - Component libraries available - Helper functions that could apply
</action>

<action>Find reference implementations: - Similar features in other parts of codebase - Established patterns to follow - Testing approaches used elsewhere
</action>

<template-output>related_code_references</template-output>
<template-output>reuse_opportunities</template-output>
</step>

<step n="13e" goal="Generate comprehensive deep-dive documentation">
  <action>Create documentation filename: deep-dive-{{sanitized_target_name}}.md</action>
  <action>Use template from: {installed_path}/templates/deep-dive-template.md</action>
  <action>Aggregate contributor insights across files:
    - Combine unique risk/gotcha notes into {{risks_notes}}
    - Combine verification steps developers should run before changes into {{verification_steps}}
    - Combine recommended test commands into {{suggested_tests}}
  </action>

<action>Generate complete documentation with:

# {{target_name}} - Deep Dive Documentation

**Generated:** {{date}}
**Scope:** {{target_path}}
**Files Analyzed:** {{file_count}}
**Lines of Code:** {{total_loc}}
**Workflow Mode:** Exhaustive Deep-Dive

## Overview

{{target_description}}

**Purpose:** {{target_purpose}}
**Key Responsibilities:** {{responsibilities}}
**Integration Points:** {{integration_summary}}

## Complete File Inventory

{{#each files_in_inventory}}

### {{file_path}}

**Purpose:** {{purpose}}
**Lines of Code:** {{loc}}
**File Type:** {{file_type}}

**What Future Contributors Must Know:** {{contributor_note}}

**Exports:**
{{#each exports}}

- `{{signature}}` - {{description}}
  {{/each}}

**Dependencies:**
{{#each imports}}

- `{{import_path}}` - {{reason}}
  {{/each}}

**Used By:**
{{#each dependents}}

- `{{dependent_path}}`
  {{/each}}

**Key Implementation Details:**

```{{language}}
{{key_code_snippet}}
```

{{implementation_notes}}

**Patterns Used:**
{{#each patterns}}

- {{pattern_name}}: {{pattern_description}}
  {{/each}}

**State Management:** {{state_approach}}

**Side Effects:**
{{#each side_effects}}

- {{effect_type}}: {{effect_description}}
  {{/each}}

**Error Handling:** {{error_handling_approach}}

**Testing:**

- Test File: {{test_file_path}}
- Coverage: {{coverage_percentage}}%
- Test Approach: {{test_approach}}

**Comments/TODOs:**
{{#each todos}}

- Line {{line_number}}: {{todo_text}}
  {{/each}}

---

{{/each}}

## Contributor Checklist

- **Risks & Gotchas:** {{risks_notes}}
- **Pre-change Verification Steps:** {{verification_steps}}
- **Suggested Tests Before PR:** {{suggested_tests}}

## Architecture & Design Patterns

### Code Organization

{{organization_approach}}

### Design Patterns

{{#each design_patterns}}

- **{{pattern_name}}**: {{usage_description}}
  {{/each}}

### State Management Strategy

{{state_management_details}}

### Error Handling Philosophy

{{error_handling_philosophy}}

### Testing Strategy

{{testing_strategy}}

## Data Flow

{{data_flow_diagram}}

### Data Entry Points

{{#each entry_points}}

- **{{entry_name}}**: {{entry_description}}
  {{/each}}

### Data Transformations

{{#each transformations}}

- **{{transformation_name}}**: {{transformation_description}}
  {{/each}}

### Data Exit Points

{{#each exit_points}}

- **{{exit_name}}**: {{exit_description}}
  {{/each}}

## Integration Points

### APIs Consumed

{{#each apis_consumed}}

- **{{api_endpoint}}**: {{api_description}}
  - Method: {{method}}
  - Authentication: {{auth_requirement}}
  - Response: {{response_schema}}
    {{/each}}

### APIs Exposed

{{#each apis_exposed}}

- **{{api_endpoint}}**: {{api_description}}
  - Method: {{method}}
  - Request: {{request_schema}}
  - Response: {{response_schema}}
    {{/each}}

### Shared State

{{#each shared_state}}

- **{{state_name}}**: {{state_description}}
  - Type: {{state_type}}
  - Accessed By: {{accessors}}
    {{/each}}

### Events

{{#each events}}

- **{{event_name}}**: {{event_description}}
  - Type: {{publish_or_subscribe}}
  - Payload: {{payload_schema}}
    {{/each}}

### Database Access

{{#each database_operations}}

- **{{table_name}}**: {{operation_type}}
  - Queries: {{query_patterns}}
  - Indexes Used: {{indexes}}
    {{/each}}

## Dependency Graph

{{dependency_graph_visualization}}

### Entry Points (Not Imported by Others in Scope)

{{#each entry_point_files}}

- {{file_path}}
  {{/each}}

### Leaf Nodes (Don't Import Others in Scope)

{{#each leaf_files}}

- {{file_path}}
  {{/each}}

### Circular Dependencies

{{#if has_circular_dependencies}}
⚠️ Circular dependencies detected:
{{#each circular_deps}}

- {{cycle_description}}
  {{/each}}
  {{else}}
  ✓ No circular dependencies detected
  {{/if}}

## Testing Analysis

### Test Coverage Summary

- **Statements:** {{statements_coverage}}%
- **Branches:** {{branches_coverage}}%
- **Functions:** {{functions_coverage}}%
- **Lines:** {{lines_coverage}}%

### Test Files

{{#each test_files}}

- **{{test_file_path}}**
  - Tests: {{test_count}}
  - Approach: {{test_approach}}
  - Mocking Strategy: {{mocking_strategy}}
    {{/each}}

### Test Utilities Available

{{#each test_utilities}}

- `{{utility_name}}`: {{utility_description}}
  {{/each}}

### Testing Gaps

{{#each testing_gaps}}

- {{gap_description}}
  {{/each}}

## Related Code & Reuse Opportunities

### Similar Features Elsewhere

{{#each similar_features}}

- **{{feature_name}}** (`{{feature_path}}`)
  - Similarity: {{similarity_description}}
  - Can Reference For: {{reference_use_case}}
    {{/each}}

### Reusable Utilities Available

{{#each reusable_utilities}}

- **{{utility_name}}** (`{{utility_path}}`)
  - Purpose: {{utility_purpose}}
  - How to Use: {{usage_example}}
    {{/each}}

### Patterns to Follow

{{#each patterns_to_follow}}

- **{{pattern_name}}**: Reference `{{reference_file}}` for implementation
  {{/each}}

## Implementation Notes

### Code Quality Observations

{{#each quality_observations}}

- {{observation}}
  {{/each}}

### TODOs and Future Work

{{#each all_todos}}

- **{{file_path}}:{{line_number}}**: {{todo_text}}
  {{/each}}

### Known Issues

{{#each known_issues}}

- {{issue_description}}
  {{/each}}

### Optimization Opportunities

{{#each optimizations}}

- {{optimization_suggestion}}
  {{/each}}

### Technical Debt

{{#each tech_debt_items}}

- {{debt_description}}
  {{/each}}

## Modification Guidance

### To Add New Functionality

{{modification_guidance_add}}

### To Modify Existing Functionality

{{modification_guidance_modify}}

### To Remove/Deprecate

{{modification_guidance_remove}}

### Testing Checklist for Changes

{{#each testing_checklist_items}}

- [ ] {{checklist_item}}
      {{/each}}

---

_Generated by `document-project` workflow (deep-dive mode)_
_Base Documentation: docs/index.md_
_Scan Date: {{date}}_
_Analysis Mode: Exhaustive_
</action>

<action>Save documentation to: {output_folder}/deep-dive-{{sanitized_target_name}}.md</action>
<action>Validate deep-dive document completeness</action>

<template-output>deep_dive_documentation</template-output>

<action>Update state file: - Add to deep_dive_targets array: {"target_name": "{{target_name}}", "target_path": "{{target_path}}", "files_analyzed": {{file_count}}, "output_file": "deep-dive-{{sanitized_target_name}}.md", "timestamp": "{{now}}"} - Add output to outputs_generated - Update last_updated timestamp
</action>
</step>

<step n="13f" goal="Update master index with deep-dive link">
  <action>Read existing index.md</action>

<action>Check if "Deep-Dive Documentation" section exists</action>

  <check if="section does not exist">
    <action>Add new section after "Generated Documentation":

## Deep-Dive Documentation

Detailed exhaustive analysis of specific areas:

    </action>

  </check>

<action>Add link to new deep-dive doc:

- [{{target_name}} Deep-Dive](./deep-dive-{{sanitized_target_name}}.md) - Comprehensive analysis of {{target_description}} ({{file_count}} files, {{total_loc}} LOC) - Generated {{date}}
  </action>

  <action>Update index metadata:
  Last Updated: {{date}}
  Deep-Dives: {{deep_dive_count}}
  </action>

  <action>Save updated index.md</action>

  <template-output>updated_index</template-output>
  </step>

<step n="13g" goal="Offer to continue or complete">
  <action>Display summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Deep-Dive Documentation Complete! ✓

**Generated:** {output_folder}/deep-dive-{{target_name}}.md
**Files Analyzed:** {{file_count}}
**Lines of Code Scanned:** {{total_loc}}
**Time Taken:** ~{{duration}}

**Documentation Includes:**

- Complete file inventory with all exports
- Dependency graph and data flow
- Integration points and API contracts
- Testing analysis and coverage
- Related code and reuse opportunities
- Implementation guidance

**Index Updated:** {output_folder}/index.md now includes link to this deep-dive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<ask>Would you like to:

1. **Deep-dive another area** - Analyze another feature/module/folder
2. **Finish** - Complete workflow

Your choice [1/2]:
</ask>

  <action if="user selects 1">
    <action>Clear current deep_dive_target</action>
    <action>Go to Step 13a (select new area)</action>
  </action>

  <action if="user selects 2">
    <action>Display final message:

All deep-dive documentation complete!

**Master Index:** {output_folder}/index.md
**Deep-Dives Generated:** {{deep_dive_count}}

These comprehensive docs are now ready for:

- Architecture review
- Implementation planning
- Code understanding
- Brownfield PRD creation

Thank you for using the document-project workflow!
</action>
<action>Exit workflow</action>
</action>
</step>
</step>

</workflow>
