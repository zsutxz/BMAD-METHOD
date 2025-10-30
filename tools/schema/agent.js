// Zod schema definition for *.agent.yaml files
const assert = require('node:assert');
const { z } = require('zod');

const COMMAND_TARGET_KEYS = ['workflow', 'validate-workflow', 'exec', 'action', 'tmpl', 'data', 'run-workflow'];
const TRIGGER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Public API ---------------------------------------------------------------

/**
 * Validate an agent YAML payload against the schema derived from its file location.
 * Exposed as the single public entry point, so callers do not reach into schema internals.
 *
 * @param {string} filePath Path to the agent file (used to infer module scope).
 * @param {unknown} agentYaml Parsed YAML content.
 * @returns {import('zod').SafeParseReturnType<unknown, unknown>} SafeParse result.
 */
function validateAgentFile(filePath, agentYaml) {
  const expectedModule = deriveModuleFromPath(filePath);
  const schema = agentSchema({ module: expectedModule });
  return schema.safeParse(agentYaml);
}

module.exports = { validateAgentFile };

// Internal helpers ---------------------------------------------------------

/**
 * Build a Zod schema for validating a single agent definition.
 * The schema is generated per call so module-scoped agents can pass their expected
 * module slug while core agents leave it undefined.
 *
 * @param {Object} [options]
 * @param {string|null|undefined} [options.module] Module slug for module agents; omit or null for core agents.
 * @returns {import('zod').ZodSchema} Configured Zod schema instance.
 */
function agentSchema(options = {}) {
  const expectedModule = normalizeModuleOption(options.module);

  return (
    z
      .object({
        agent: buildAgentSchema(expectedModule),
      })
      .strict()
      // Refinement: enforce trigger format and uniqueness rules after structural checks.
      .superRefine((value, ctx) => {
        const seenTriggers = new Set();

        let index = 0;
        for (const item of value.agent.menu) {
          const triggerValue = item.trigger;

          if (!TRIGGER_PATTERN.test(triggerValue)) {
            ctx.addIssue({
              code: 'custom',
              path: ['agent', 'menu', index, 'trigger'],
              message: 'agent.menu[].trigger must be kebab-case (lowercase words separated by hyphen)',
            });
            return;
          }

          if (seenTriggers.has(triggerValue)) {
            ctx.addIssue({
              code: 'custom',
              path: ['agent', 'menu', index, 'trigger'],
              message: `agent.menu[].trigger duplicates "${triggerValue}" within the same agent`,
            });
            return;
          }

          seenTriggers.add(triggerValue);
          index += 1;
        }
      })
  );
}

/**
 * Assemble the full agent schema using the module expectation provided by the caller.
 * @param {string|null} expectedModule Trimmed module slug or null for core agents.
 */
function buildAgentSchema(expectedModule) {
  return z
    .object({
      metadata: buildMetadataSchema(expectedModule),
      persona: buildPersonaSchema(),
      critical_actions: z.array(createNonEmptyString('agent.critical_actions[]')).optional(),
      menu: z.array(buildMenuItemSchema()).min(1, { message: 'agent.menu must include at least one entry' }),
      prompts: z.array(buildPromptSchema()).optional(),
    })
    .strict();
}

/**
 * Validate metadata shape and cross-check module expectation against caller input.
 * @param {string|null} expectedModule Trimmed module slug or null when core agent metadata is expected.
 */
function buildMetadataSchema(expectedModule) {
  const schemaShape = {
    id: createNonEmptyString('agent.metadata.id'),
    name: createNonEmptyString('agent.metadata.name'),
    title: createNonEmptyString('agent.metadata.title'),
    icon: createNonEmptyString('agent.metadata.icon'),
    module: createNonEmptyString('agent.metadata.module').optional(),
  };

  return (
    z
      .object(schemaShape)
      .strict()
      // Refinement: guard presence and correctness of metadata.module.
      .superRefine((value, ctx) => {
        const moduleValue = typeof value.module === 'string' ? value.module.trim() : null;

        if (expectedModule && !moduleValue) {
          ctx.addIssue({
            code: 'custom',
            path: ['module'],
            message: 'module-scoped agents must declare agent.metadata.module',
          });
        } else if (!expectedModule && moduleValue) {
          ctx.addIssue({
            code: 'custom',
            path: ['module'],
            message: 'core agents must not include agent.metadata.module',
          });
        } else if (expectedModule && moduleValue !== expectedModule) {
          ctx.addIssue({
            code: 'custom',
            path: ['module'],
            message: `agent.metadata.module must equal "${expectedModule}"`,
          });
        }
      })
  );
}

function buildPersonaSchema() {
  return z
    .object({
      role: createNonEmptyString('agent.persona.role'),
      identity: createNonEmptyString('agent.persona.identity'),
      communication_style: createNonEmptyString('agent.persona.communication_style'),
      principles: z
        .array(createNonEmptyString('agent.persona.principles[]'))
        .min(1, { message: 'agent.persona.principles must include at least one entry' }),
    })
    .strict();
}

function buildPromptSchema() {
  return z
    .object({
      id: createNonEmptyString('agent.prompts[].id'),
      content: z.string().refine((value) => value.trim().length > 0, {
        message: 'agent.prompts[].content must be a non-empty string',
      }),
      description: createNonEmptyString('agent.prompts[].description').optional(),
    })
    .strict();
}

/**
 * Schema for individual menu entries ensuring they are actionable.
 */
function buildMenuItemSchema() {
  return z
    .object({
      trigger: createNonEmptyString('agent.menu[].trigger'),
      description: createNonEmptyString('agent.menu[].description'),
      workflow: createNonEmptyString('agent.menu[].workflow').optional(),
      'validate-workflow': createNonEmptyString('agent.menu[].validate-workflow').optional(),
      exec: createNonEmptyString('agent.menu[].exec').optional(),
      action: createNonEmptyString('agent.menu[].action').optional(),
      tmpl: createNonEmptyString('agent.menu[].tmpl').optional(),
      data: createNonEmptyString('agent.menu[].data').optional(),
      'run-workflow': createNonEmptyString('agent.menu[].run-workflow').optional(),
    })
    .strict()
    .superRefine((value, ctx) => {
      const hasCommandTarget = COMMAND_TARGET_KEYS.some((key) => {
        const commandValue = value[key];
        return typeof commandValue === 'string' && commandValue.trim().length > 0;
      });

      if (!hasCommandTarget) {
        ctx.addIssue({
          code: 'custom',
          message: 'agent.menu[] entries must include at least one command target field',
        });
      }
    });
}

/**
 * Derive the expected module slug from a file path residing under src/modules/<module>/agents/.
 * @param {string} filePath Absolute or relative agent path.
 * @returns {string|null} Module slug if identifiable, otherwise null.
 */
function deriveModuleFromPath(filePath) {
  assert(filePath, 'validateAgentFile expects filePath to be provided');
  assert(typeof filePath === 'string', 'validateAgentFile expects filePath to be a string');
  assert(filePath.startsWith('src/'), 'validateAgentFile expects filePath to start with "src/"');

  const marker = 'src/modules/';
  if (!filePath.startsWith(marker)) {
    return null;
  }

  const remainder = filePath.slice(marker.length);
  const slashIndex = remainder.indexOf('/');
  return slashIndex === -1 ? null : remainder.slice(0, slashIndex);
}

function normalizeModuleOption(moduleOption) {
  if (typeof moduleOption !== 'string') {
    return null;
  }

  const trimmed = moduleOption.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// Primitive validators -----------------------------------------------------

function createNonEmptyString(label) {
  return z.string().refine((value) => value.trim().length > 0, {
    message: `${label} must be a non-empty string`,
  });
}
