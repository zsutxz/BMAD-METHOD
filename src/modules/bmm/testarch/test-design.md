<!-- Powered by BMAD-CORE™ -->

# Risk & Test Design v3.0 (Slim)

```xml
<task id="bmad/bmm/testarch/test-design" name="Risk & Test Design">
  <llm critical="true">
    <i>Set command_key="*test-design"</i>
    <i>Load {project-root}/bmad/bmm/testarch/tea-commands.csv and parse the matching row</i>
    <i>Load {project-root}/bmad/bmm/testarch/tea-knowledge.md for risk-model and coverage heuristics</i>
    <i>Use CSV columns preflight, flow_cues, deliverables, halt_rules, notes, knowledge_tags as the execution blueprint</i>
    <i>Split pipe-delimited values into actionable checklists</i>
    <i>Stay evidence-based—link risks and scenarios directly to PRD/architecture/story artifacts</i>
  </llm>
  <flow>
    <step n="1" title="Preflight">
      <action>Confirm story markdown, acceptance criteria, and architecture/PRD access.</action>
      <action>Stop immediately if halt_rules trigger (missing inputs or unclear requirements).</action>
    </step>
    <step n="2" title="Assess Risks">
      <action>Follow flow_cues to filter genuine risks, classify them (TECH/SEC/PERF/DATA/BUS/OPS), and score probability × impact.</action>
      <action>Document mitigations with owners, timelines, and residual risk expectations.</action>
    </step>
    <step n="3" title="Design Coverage">
      <action>Break acceptance criteria into atomic scenarios mapped to mitigations.</action>
      <action>Choose test levels using test-levels-framework.md, assign priorities via test-priorities-matrix.md, and note tooling/data prerequisites.</action>
    </step>
    <step n="4" title="Deliverables">
      <action>Generate the combined risk report and test design artifacts described in deliverables.</action>
      <action>Summarize key risks, mitigations, coverage plan, and recommended execution order.</action>
    </step>
  </flow>
  <halt>
    <i>Apply halt_rules from the CSV row verbatim.</i>
  </halt>
  <notes>
    <i>Use notes column for calibration reminders and coverage heuristics.</i>
  </notes>
  <output>
    <i>Unified risk assessment plus coverage strategy ready for implementation.</i>
  </output>
</task>
```
