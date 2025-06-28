// Test script to verify IDE setup paths for expansion pack agents
const path = require('path');
const fs = require('fs-extra');

// Simulate the findAgentPath logic
function simulateFindAgentPath(agentId, installDir) {
  const possiblePaths = [
    path.join(installDir, ".bmad-core", "agents", `${agentId}.md`),
    path.join(installDir, "agents", `${agentId}.md`),
    // Expansion pack paths
    path.join(installDir, ".bmad-2d-phaser-game-dev", "agents", `${agentId}.md`),
    path.join(installDir, ".bmad-infrastructure-devops", "agents", `${agentId}.md`),
    path.join(installDir, ".bmad-creator-tools", "agents", `${agentId}.md`)
  ];
  
  // Simulate finding the agent in an expansion pack
  if (agentId === 'game-developer') {
    return path.join(installDir, ".bmad-2d-phaser-game-dev", "agents", `${agentId}.md`);
  }
  
  // Default to core
  return path.join(installDir, ".bmad-core", "agents", `${agentId}.md`);
}

// Test different scenarios
const testDir = '/project';
const agents = ['dev', 'game-developer', 'infra-devops-platform'];

console.log('Testing IDE path references:\n');

agents.forEach(agentId => {
  const agentPath = simulateFindAgentPath(agentId, testDir);
  const relativePath = path.relative(testDir, agentPath).replace(/\\/g, '/');
  
  console.log(`Agent: ${agentId}`);
  console.log(`  Full path: ${agentPath}`);
  console.log(`  Relative path: ${relativePath}`);
  console.log(`  Roo customInstructions: CRITICAL Read the full YML from ${relativePath} ...`);
  console.log(`  Cursor MDC reference: [${relativePath}](mdc:${relativePath})`);
  console.log('');
});