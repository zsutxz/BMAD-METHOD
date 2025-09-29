# v6 Pending Items

## Needed before Alpha → Beta

Aside from stability and bug fixes found during the alpha period - the main focus will be on the following:

- Single Agent web bundler finalized
- Team Web Bundler functional
- bmm `testarch` converted to a standalone module or integrated into the BMM workflow's after aligned with the rest of bmad method flow.
- All project levels (0 through 4) manual flows validated through workflow phase 1-4
  - level 0 (simple addition or update to existing project) workflow is super streamlined from explanation of issue through code implementation
    - simple spec file -> context -> implementation
  - level 1 (simple update to existing, or a very simple oneshot tool or project)
- NPX installer
- github pipelines, branch protection, vulnerability scanners
- improved subagent injections
- bmm existing project scanning and integration with workflow phase 1-4 improvements

## Needed before Beta → v0 release

Once the alpha is stabilized and we switch to beta, work on v4.x will freeze and the beta will merge to main. The NPX installer will still install v4 by default, but people will be able to npm install the beta version also.

- Orchestration tracking works consistently across all workflow phases on BMM module
- Module repository and submission process defined
- Final polished documentation and user guide for each module
- Final polished documentation for overall project architecture
- MCP Injections based on installation selection
- TDD Workflow Integration
- BMad-Master BMad-Init workflow will be a single entrypoint agent command that will set the user on the correct path and workflow. BMad-Init will become very powerful in the future, empowering the BMad Master to be a full orchestrator across any current or future module.

## Late Beta or Post v0 official release items

- Installer offers installation of vetted community modules
- DevOps Module
- Security Module
- BoMB improvements
- 2-3 functional Reference Architecture Project Scaffolds and community contribution process defined
