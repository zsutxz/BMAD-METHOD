# TermTodo Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Deliver a terminal todo app that executes all commands in under 100ms
- Eliminate context switching for developers who live in the command line
- Provide intuitive task management through simple, memorable commands
- Enable seamless integration with existing terminal workflows (git, editors, scripts)
- Achieve zero data loss with robust local SQLite storage
- Build a tool that feels native to terminal power users
- Create a maintainable single-binary distribution for easy installation

### Background Context

TermTodo addresses a critical gap in developer productivity tools. While numerous todo applications exist, they force developers to break their flow by switching between terminal and GUI applications. Current solutions are either bloated web applications with unnecessary features or simplistic command-line tools that lack essential task management capabilities. TermTodo strikes the balance by providing a fast, local-first solution that integrates naturally into terminal-based workflows.

The application targets developers and system administrators who value speed and efficiency over visual polish. By focusing on sub-100ms execution times and keyboard-driven interactions, TermTodo eliminates the friction that prevents consistent task tracking in fast-paced development environments. The choice of Rust ensures performance goals are met while providing a single binary that's easy to distribute and install across Linux, macOS, and Windows (WSL) platforms.

### Change Log

| Date       | Version | Description                                 | Author   |
| ---------- | ------- | ------------------------------------------- | -------- |
| 2025-07-07 | 1.0     | Initial PRD creation based on Project Brief | PM Agent |

## Requirements

### Functional

- FR1: The application must support adding tasks with a single command (e.g., `todo add "Complete code review"`)
- FR2: Users must be able to mark tasks as complete/incomplete with toggle functionality
- FR3: The application must support editing existing task descriptions
- FR4: Users must be able to delete individual tasks or bulk delete completed tasks
- FR5: The application must list tasks with configurable filtering by status, priority, project, and tags
- FR6: Task organization must support project-based grouping with easy project switching
- FR7: Each task must support priority levels (high, medium, low) with visual indicators in listings
- FR8: Tasks must support optional due dates with human-readable input (e.g., "tomorrow", "next friday")
- FR9: The application must provide full-text search across all task fields
- FR10: Users must be able to add and remove tags from tasks for flexible categorization
- FR11: The application must support task templates for recurring task patterns
- FR12: Shell completion must be available for all commands and common parameters
- FR13: The application must provide export functionality to common formats (JSON, CSV, Markdown)
- FR14: Configuration must be manageable through TOML files with sensible defaults

### Non Functional

- NFR1: All commands must execute in under 100ms from invocation to completion
- NFR2: Cold start time must be under 50ms on standard developer hardware
- NFR3: Memory usage must not exceed 10MB during normal operation
- NFR4: The application must be distributed as a single static binary with no runtime dependencies
- NFR5: Data storage must use SQLite with ACID compliance for zero data loss
- NFR6: The CLI must follow Unix conventions (stdin/stdout, exit codes, composability)
- NFR7: All user-facing messages must be clear, concise, and actionable
- NFR8: The application must support Linux and macOS as primary platforms, Windows via WSL
- NFR9: Installation must be possible through major package managers (brew, apt, cargo)
- NFR10: The codebase must maintain 80%+ test coverage for reliability
- NFR11: All commands must be documented with man pages and --help output
- NFR12: The application must handle 10,000+ tasks without performance degradation
- NFR13: Error messages must provide clear guidance for resolution
- NFR14: The application must support UTF-8 for international task descriptions

## Technical Assumptions

### Repository Structure: Monorepo

Single repository containing all TermTodo code, tests, documentation, and build configurations. This simplifies development, testing, and distribution for a focused CLI tool.

### Service Architecture

**Monolith** - TermTodo will be built as a single, self-contained binary with all functionality compiled in. This architecture aligns with our performance goals (sub-50ms startup) and distribution requirements (single binary). The SQLite database will be embedded, and all operations will run in-process without network dependencies.

### Testing Requirements

**Full Testing Pyramid** - Given the critical nature of data integrity and performance requirements:

- **Unit Tests**: Core business logic, data models, command parsing
- **Integration Tests**: SQLite operations, file I/O, command execution flows
- **E2E Tests**: Full command-line scenarios using the actual binary
- **Performance Tests**: Automated benchmarks ensuring sub-100ms execution
- **Manual Testing Helpers**: Debug commands and verbose modes for troubleshooting

### Additional Technical Assumptions and Requests

- **Language**: Rust (as specified in Project Brief) for performance and memory safety
- **CLI Framework**: Clap v4+ for robust argument parsing and automatic help generation
- **Database**: SQLite with schema migrations support (using sqlx or diesel)
- **Error Handling**: Comprehensive error types with user-friendly messages using anyhow/thiserror
- **Configuration**: TOML for human-readable config files, with XDG base directory compliance
- **Build System**: Cargo with cross-compilation support for Linux/macOS/Windows targets
- **Serialization**: Serde for JSON/CSV export functionality
- **Date Parsing**: Chrono with chrono-english for human-readable date input
- **Terminal Output**: Colored output using termcolor, respecting NO_COLOR environment variable
- **Shell Completion**: Built-in completion generation for bash, zsh, fish, and PowerShell
- **Packaging**: Release binaries via GitHub releases, plus cargo, brew tap, and AUR support
- **Documentation**: Embedded man pages generated from clap, README with examples
- **Logging**: Optional debug logging to file (not stdout) for troubleshooting
- **Benchmarking**: Criterion.rs for performance regression testing in CI

## Epic List

- **Epic 1: Foundation & Core Task Management**: Establish project infrastructure, CI/CD, and implement basic CRUD operations for tasks with SQLite storage
- **Epic 2: Organization & Filtering**: Implement project-based task grouping, priority levels, tags, and comprehensive filtering capabilities
- **Epic 3: Advanced Features & Integration**: Add due dates, search functionality, shell completion, templates, and import/export capabilities

## Epic 1: Foundation & Core Task Management

Establish the foundational infrastructure for TermTodo including project setup, continuous integration, and core task CRUD operations. This epic delivers a functional but minimal todo application that can add, list, complete, and delete tasks with persistent SQLite storage, while meeting our aggressive performance requirements.

### Story 1.1: Project Setup and Infrastructure

As a developer,
I want a properly structured Rust project with CI/CD pipelines,
so that I can ensure code quality and automated releases from the start.

#### Acceptance Criteria

1: Repository initialized with Rust project structure and .gitignore
2: Cargo.toml configured with project metadata and initial dependencies (clap, sqlx, tokio)
3: GitHub Actions workflow for CI (test, lint, build) on all platforms
4: GitHub Actions workflow for CD (release binaries) on tag push
5: Basic README with project description and development setup instructions
6: Pre-commit hooks configured for formatting (rustfmt) and linting (clippy)
7: MIT License file added
8: Makefile with common development commands (test, build, release)

### Story 1.2: CLI Framework and Command Structure

As a user,
I want a well-structured command-line interface with help documentation,
so that I can easily discover and use all available commands.

#### Acceptance Criteria

1: Main CLI entry point implemented with clap v4
2: Subcommand structure established (add, list, complete, delete, etc.)
3: Global flags implemented (--version, --help, --config)
4: Auto-generated help text for all commands and subcommands
5: Version information properly displayed from Cargo.toml
6: Exit codes follow Unix conventions (0 for success, non-zero for errors)
7: Basic error handling structure with user-friendly messages

### Story 1.3: SQLite Database Layer

As a developer,
I want a robust database layer with schema management,
so that I can reliably store and retrieve tasks with ACID compliance.

#### Acceptance Criteria

1: SQLite connection pool initialized with proper settings
2: Initial schema migration creating tasks table (id, description, status, created_at, updated_at)
3: Migration system implemented for future schema changes
4: Database file created in XDG-compliant data directory
5: Connection timeout and busy handling configured for concurrent access
6: Basic database error handling with rollback support
7: Database layer abstraction with trait for testability

### Story 1.4: Add Task Functionality

As a user,
I want to quickly add new tasks from the command line,
so that I can capture todo items without breaking my workflow.

#### Acceptance Criteria

1: "todo add <description>" command creates new task in database
2: Task description supports UTF-8 and quotes/special characters
3: Newly created task ID displayed on successful addition
4: Task creation timestamp automatically recorded
5: Performance requirement met: command completes in <100ms
6: Error shown if description is empty or too long (>1000 chars)
7: Success message confirms task was added

### Story 1.5: List Tasks Functionality

As a user,
I want to see my current tasks in a clear format,
so that I can review what needs to be done.

#### Acceptance Criteria

1: "todo list" command displays all incomplete tasks
2: Output shows task ID, description, and age (e.g., "2 days ago")
3: Tasks sorted by creation date (oldest first) by default
4: Completed tasks hidden by default
5: "--all" flag shows both complete and incomplete tasks
6: Empty state message when no tasks exist
7: Output formatted for terminal width with proper truncation

### Story 1.6: Complete Task Functionality

As a user,
I want to mark tasks as complete,
so that I can track my progress.

#### Acceptance Criteria

1: "todo complete <id>" marks specified task as complete
2: Multiple IDs can be provided to complete multiple tasks
3: Completion timestamp recorded in database
4: Success message confirms which task(s) were completed
5: Error shown for non-existent task IDs
6: Already-completed tasks can be marked complete again (idempotent)
7: Performance requirement met: command completes in <100ms

### Story 1.7: Delete Task Functionality

As a user,
I want to delete tasks I no longer need,
so that I can keep my task list clean and relevant.

#### Acceptance Criteria

1: "todo delete <id>" removes specified task from database
2: Multiple IDs can be provided to delete multiple tasks
3: Confirmation required by default (bypass with --force flag)
4: Success message confirms which task(s) were deleted
5: Error shown for non-existent task IDs
6: "todo delete --completed" removes all completed tasks
7: Deleted tasks cannot be recovered (documented in help)

## Epic 2: Organization & Filtering

Implement comprehensive task organization features including projects, priorities, tags, and filtering capabilities. This epic transforms the basic todo app into a powerful task management system that can handle complex workflows while maintaining simplicity and performance.

### Story 2.1: Project-Based Task Grouping

As a developer working on multiple projects,
I want to organize tasks by project,
so that I can focus on relevant tasks for my current context.

#### Acceptance Criteria

1: Tasks table schema updated to include optional project field
2: "todo add -p <project> <description>" assigns task to project
3: "todo list -p <project>" filters tasks by project
4: "todo projects" lists all unique projects with task counts
5: Default project configurable in TOML config file
6: Project names validated (alphanumeric + dash/underscore)
7: Tasks without project show under "default" in listings

### Story 2.2: Priority Levels

As a user,
I want to assign priority levels to tasks,
so that I can focus on what's most important.

#### Acceptance Criteria

1: Tasks table schema updated to include priority field (high/medium/low)
2: "todo add -P high <description>" sets task priority
3: Default priority is "medium" if not specified
4: Priority shown in task listings with visual indicators (!, !!, !!!)
5: "todo list --priority high" filters by priority level
6: Tasks sorted by priority within date sorting
7: Priority can be updated with "todo priority <id> <level>"

### Story 2.3: Tag System

As a user,
I want to add tags to tasks for flexible categorization,
so that I can create custom organizational schemes.

#### Acceptance Criteria

1: Tags table created with many-to-many relationship to tasks
2: "todo add <description> +tag1 +tag2" adds tags during creation
3: Tags parsed from description (+ prefix) and stored separately
4: "todo tag <id> +tag" adds tags to existing tasks
5: "todo tag <id> -tag" removes tags from tasks
6: "todo list +tag" filters tasks by tag
7: "todo tags" lists all tags with usage counts

### Story 2.4: Advanced Filtering

As a power user,
I want to combine multiple filters when listing tasks,
so that I can create precise views of my work.

#### Acceptance Criteria

1: Multiple filters can be combined (project AND priority AND tags)
2: "todo list -p work -P high +urgent" shows filtered results
3: Date range filtering with --since and --until flags
4: Status filtering with --status (incomplete/complete/all)
5: Inverse filters supported with --not-project, --not-tag
6: Filter combinations can be saved as named views in config
7: Performance maintained under 100ms even with complex filters

### Story 2.5: Configuration Management

As a user,
I want to customize default behaviors and preferences,
so that the tool works the way I prefer.

#### Acceptance Criteria

1: TOML config file created at XDG config location on first run
2: Config supports: default project, default priority, date format
3: Config supports: color preferences, list sort order
4: "todo config" opens config file in $EDITOR
5: "todo config --list" shows current configuration
6: Invalid config shows clear error without crashing
7: Config changes take effect immediately (no restart needed)

## Epic 3: Advanced Features & Integration

Add power-user features including due dates, full-text search, shell completion, templates, and data portability. This epic completes the feature set needed for TermTodo to become an indispensable part of a developer's workflow.

### Story 3.1: Due Date Support

As a user,
I want to set due dates on tasks,
so that I can manage time-sensitive work effectively.

#### Acceptance Criteria

1: Tasks table schema updated to include optional due_date field
2: "todo add <description> due:tomorrow" sets due date with natural language
3: Supported formats: "due:2024-12-31", "due:friday", "due:3d" (3 days)
4: Due dates shown in task listings with urgency indicators
5: "todo list --due" shows only tasks with due dates
6: "todo list --overdue" shows past-due tasks highlighted
7: Due date can be updated with "todo due <id> <date>"

### Story 3.2: Full-Text Search

As a user with many tasks,
I want to search across all task fields,
so that I can quickly find specific items.

#### Acceptance Criteria

1: "todo search <query>" searches description, project, and tags
2: Search uses SQLite FTS5 for performance and features
3: Results show matched tasks with search terms highlighted
4: Search supports quoted phrases for exact matching
5: Boolean operators AND/OR supported in queries
6: Search results include context around matches
7: Performance requirement met: search completes in <100ms

### Story 3.3: Shell Completion

As a command-line power user,
I want shell completion for all commands and parameters,
so that I can work more efficiently.

#### Acceptance Criteria

1: Completion scripts generated for bash, zsh, fish, PowerShell
2: Command completion includes all subcommands and flags
3: Project names completed for -p flag from existing projects
4: Tag names completed after + prefix from existing tags
5: Task IDs completed for complete/delete/update commands
6: Installation instructions included in README
7: Completion scripts included in distribution packages

### Story 3.4: Task Templates

As a user with recurring task patterns,
I want to create templates for common tasks,
so that I can quickly add similar tasks.

#### Acceptance Criteria

1: Templates stored in TOML config file with name and pattern
2: "todo template create <name>" interactively creates template
3: "todo template list" shows available templates
4: "todo add --template <name>" creates task from template
5: Templates support placeholders like {date}, {project}
6: Templates can include default project, priority, tags
7: "todo template delete <name>" removes unused templates

### Story 3.5: Import/Export Functionality

As a user,
I want to export and import my tasks in common formats,
so that I can backup data or integrate with other tools.

#### Acceptance Criteria

1: "todo export --format json" exports all tasks to JSON
2: "todo export --format csv" exports tasks to CSV format
3: "todo export --format markdown" creates Markdown task list
4: Export supports filtering (only export filtered tasks)
5: "todo import <file>" imports tasks from JSON format
6: Import validates data and reports errors without corruption
7: Export includes all fields: description, project, priority, tags, dates

### Story 3.6: Performance Optimization

As a developer using the tool hundreds of times per day,
I want consistent sub-100ms performance,
so that the tool never slows down my workflow.

#### Acceptance Criteria

1: Benchmark suite implemented using criterion.rs
2: All commands benchmarked in CI to prevent regression
3: Database indexes optimized for common query patterns
4: Prepared statements cached for repeated queries
5: Binary size optimized with release flags and LTO
6: Cold start optimized to meet <50ms requirement
7: Performance guide documented with optimization tips

## Checklist Results Report

### Executive Summary

- **Overall PRD Completeness**: 95%
- **MVP Scope Appropriateness**: Just Right
- **Readiness for Architecture Phase**: Ready
- **Most Critical Gaps**: None - PRD is comprehensive and well-structured

### Category Analysis Table

| Category                         | Status | Critical Issues          |
| -------------------------------- | ------ | ------------------------ |
| 1. Problem Definition & Context  | PASS   | None                     |
| 2. MVP Scope Definition          | PASS   | None                     |
| 3. User Experience Requirements  | PASS   | CLI-focused, appropriate |
| 4. Functional Requirements       | PASS   | None                     |
| 5. Non-Functional Requirements   | PASS   | None                     |
| 6. Epic & Story Structure        | PASS   | None                     |
| 7. Technical Guidance            | PASS   | None                     |
| 8. Cross-Functional Requirements | PASS   | None                     |
| 9. Clarity & Communication       | PASS   | None                     |

### Top Issues by Priority

**BLOCKERS**: None identified

**HIGH**: None identified

**MEDIUM**:

- Consider adding explicit data migration strategy for future schema changes
- May want to specify exact Rust version requirements

**LOW**:

- Could add more specific examples of shell script integration possibilities
- Might benefit from explicit CI/CD tool preferences (GitHub Actions assumed)

### MVP Scope Assessment

**Scope Analysis**:

- The MVP scope is appropriately minimal while delivering core value
- Epic 1 provides a working todo app with essential CRUD operations
- Epic 2 and 3 can be delivered incrementally based on user feedback
- No features appear superfluous for the target audience

**Timeline Realism**:

- 9-week timeline is aggressive but achievable for a solo developer
- Story sizing is appropriate for AI-assisted development
- Performance requirements may require iteration but are well-defined

### Technical Readiness

**Clarity of Technical Constraints**:

- Technology stack clearly defined (Rust, SQLite, Clap)
- Performance requirements explicit and measurable
- Distribution strategy well-planned

**Identified Technical Risks**:

- SQLite cold-start performance for <50ms requirement
- Cross-platform shell completion complexity
- Natural language date parsing edge cases

**Areas Needing Architect Investigation**:

- Optimal SQLite configuration for performance
- Schema design for efficient filtering and search
- Binary size optimization strategies

### Recommendations

1. **Proceed to Architecture Phase**: The PRD is comprehensive and ready
2. **Early Performance Validation**: Create a spike to validate SQLite startup times
3. **Schema Evolution Strategy**: Document migration approach early in development
4. **User Testing Plan**: Consider early beta program for developer feedback

### Final Decision

**READY FOR ARCHITECT**: The PRD and epics are comprehensive, properly structured, and ready for architectural design. The document provides clear requirements, appropriate technical constraints, and a well-sequenced implementation plan suitable for the target developer audience.

## Next Steps

### Design Architect Prompt

Review the TermTodo PRD and create a comprehensive UI/UX design specification for this CLI application, focusing on terminal-based interaction patterns, command syntax design, output formatting, and the overall developer experience.

### Architect Prompt

Analyze the TermTodo PRD and create a detailed technical architecture document including: database schema design, Rust module structure, performance optimization strategies, error handling patterns, and a concrete implementation plan for achieving sub-100ms execution times.
