#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node update-versions.js <version>');
  process.exit(1);
}

console.log(`Updating version to ${version}`);

// Update plugin.json
const pluginJsonPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');
const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
pluginJson.version = version;
fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n');
console.log(`✓ Updated ${pluginJsonPath}`);

// Update marketplace.json
const marketplaceJsonPath = path.join(__dirname, '..', '.claude-plugin', 'marketplace.json');
const marketplaceJson = JSON.parse(fs.readFileSync(marketplaceJsonPath, 'utf8'));
marketplaceJson.plugins[0].version = version;
fs.writeFileSync(marketplaceJsonPath, JSON.stringify(marketplaceJson, null, 2) + '\n');
console.log(`✓ Updated ${marketplaceJsonPath}`);

// Update SKILL.md footer (add version info if it doesn't exist)
const skillMdPath = path.join(__dirname, '..', 'skills', 'shipmate:end-of-day-summary', 'SKILL.md');
let skillMd = fs.readFileSync(skillMdPath, 'utf8');

// Check if version footer exists
if (skillMd.includes('**Version:**')) {
  // Update existing version - match any non-whitespace after "Version:"
  skillMd = skillMd.replace(
    /\*\*Version:\*\* [^\s]+/,
    `**Version:** ${version}`
  );
  skillMd = skillMd.replace(
    /\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}/,
    `**Last Updated:** ${new Date().toISOString().split('T')[0]}`
  );
} else {
  // Add version footer
  skillMd += `\n\n---\n\n**Version:** ${version}  \n**Last Updated:** ${new Date().toISOString().split('T')[0]}\n`;
}

fs.writeFileSync(skillMdPath, skillMd);
console.log(`✓ Updated ${skillMdPath}`);

console.log(`\nAll versions updated to ${version}`);
