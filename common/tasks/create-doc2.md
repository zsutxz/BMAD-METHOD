# Create Document from Template (YAML Driven)

## Purpose

Create documents using YAML templates to drive interactive, section-by-section collaboration between AI and user.

## Core Rules

1. **NEVER output YAML** - Final document contains only clean markdown
2. **Interactive by default** - Work section-by-section unless YOLO mode
3. **YAML template drives all behavior** - Parse template, follow instructions exactly
4. **Apply elicitation when specified** - Use advanced elicitation for marked sections
5. **Present sections cleanly** - Show content for review, then apply elicitation if flagged

## YAML Template Format

Templates are full YAML files with this structure:

```yaml
template:
  id: template-name
  name: Human Readable Name
  output:
    format: markdown
    filename: docs/output.md
    title: "{{variable}} Document Title"

sections:
  - id: section-id
    title: Section Title
    instruction: "Detailed guidance for this section"
    elicit: true
    condition: "has ui"
    choices:
      repository: [Monorepo, Polyrepo]
```

## Processing Flow

### 1. Parse YAML Template

- Load template metadata (id, name, output settings)
- Extract `sections` list (required)
- Note any section with `elicit: true`, `condition: "text"`, `choices`, or `repeatable: true`
- Handle nested sections for complex document structure
- For repeatable sections, use the template structure defined in the section

### 2. Set User Preferences

**Interaction Mode:** Currently Interactive (type `#yolo` to toggle to YOLO mode)

**Output Location:** Confirm file output location from template (e.g., `docs/prd.md`). If environment doesn't support file writing (like web UI), will keep content in chat until complete.

### 3. Process Each Section

For each section in order:

**Interactive Mode:**

1. **Skip if condition unmet** - If `condition: "has ui"` and project has no UI, skip entirely
2. **Draft section content** - Use section `instruction` and handle choices/variables
3. **Handle repeatable sections** - If section has `repeatable: true`, generate multiple instances based on nested structure
4. **Present to user** - Show clean section content for review
5. **Provide detailed rationale** - Include thoughtful analysis highlighting (for example):
   - Interesting or questionable decisions made
   - Trade-offs and choices (what was chosen over alternatives and why)
   - Areas that might need user attention or validation
   - Key assumptions made during drafting
6. **Get user feedback** - Accept changes or proceed
7. **Apply elicitation if specified** - If `elicit: true`, present standardized 1-9 options:
   - Option 1: Always "Proceed to next section"
   - Options 2-9: MUST select 8 relevant methods from data/elicitation-methods (never create new ones)
   - Include "Select 1-9 or just type your question/feedback:" to allow free chat
8. **Process elicitation results** - After user selects elicitation method, present results with options:
   - Option 1: "Apply suggested changes and update section"
   - Option 2: "Return to elicitation selection (2-9 options)"
   - Free text: "Ask questions or follow-ups about this elicitation"
   - Allow multiple elicitation rounds on same section
9. **Save to document** - If document-as-we-go mode, append approved content to file
10. **Continue to next section**

**YOLO Mode:**

- Process all sections at once, then present complete document

### 4. Final Output

- Present complete document with clean markdown only
- Save to file if specified
- No YAML, no template syntax, no processing instructions

## Section Types

**Simple section:**

```yaml
- id: requirements
  title: Requirements
  instruction: "Draft functional (FR1, FR2...) and non-functional (NFR1, NFR2...) requirements"
```

**Section with elicitation:**

```yaml
- id: technical-assumptions
  title: Technical Assumptions
  instruction: "Gather technical decisions that will guide the Architect"
  elicit: true
  choices:
    architecture: [Monolith, Microservices, Serverless]
```

**Conditional section:**

```yaml
- id: ui-goals
  title: User Interface Goals
  instruction: "High-level UI/UX vision and design goals"
  condition: "has ui requirements"
  elicit: true
```

**Repeatable section with nested structure:**

```yaml
- id: epic-details
  title: Epic {{epic_number}} {{epic_title}}
  instruction: "Epic guidance with story and criteria requirements"
  elicit: true
  repeatable: true
  sections:
    - id: story
      title: Story {{epic_number}}.{{story_number}} {{story_title}}
      repeatable: true
      template: "As a {{user_type}}, I want {{action}}, so that {{benefit}}."
      sections:
        - id: criteria
          title: Acceptance Criteria
          type: numbered-list
          item_template: "{{criterion_number}}: {{criteria}}"
          repeatable: true
```

## Elicitation Loop

When user selects an elicitation method (options 2-9), follow this pattern:

1. **Execute the selected elicitation method** from data/elicitation-methods
2. **Present results** with insights and suggestions
3. **Provide follow-up options:**
   - **1. Apply suggested changes and update section**
   - **2. Return to elicitation selection** (show 2-9 options again)
   - **Free text: Ask questions or follow-ups about this elicitation**
4. **Allow multiple rounds** - User can run multiple elicitation methods on the same section
5. **Only proceed to next section** when user explicitly chooses option 1 from the main menu

## Output Modes

**Document-as-we-go (Recommended):**

- Each approved section gets written to the document file immediately
- User can see document building in real-time
- Protects against context loss or chat restart
- File always contains latest approved content

**Chat-only:**

- All content stays in chat memory until document is complete
- Full document presented at end
- Risk of losing work if context runs out

## Template Processing

1. **Load YAML template** - Parse template metadata and sections
2. **Set document title** - Use template.output.title with variables
3. **Process sections in order** - Handle conditions, repeatability, nesting
4. **Apply instructions** - Use section.instruction for guidance
5. **Handle variables** - Replace {{variable}} placeholders
6. **Process choices** - Present options from choices object
7. **Generate content** - Create markdown following section structure

## Error Prevention

**❌ Don't:**

- Show YAML in final output
- Skip conditional checks
- Ignore elicitation flags
- Output template syntax
- Apply elicitation before user approves elicitation content

**✅ Do:**

- Process sections in order
- Present clean content only
- Apply elicitation AFTER user approves section content
- Handle choice objects properly
- Generate repeatable sections dynamically
- Skip sections where conditions aren't met
- Save to document file when in document-as-we-go mode

## Key Improvements

- **YAML templates** provide much richer structure than front matter
- **Document-as-we-go** protects against context loss
- **Elicitation after approval** ensures quality content first
- **Structured choices** replace inline {choice1|choice2} syntax
- **Nested sections** support complex document hierarchies
