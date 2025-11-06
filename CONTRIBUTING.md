# Contributing to Shipmate

Thank you for your interest in contributing! This guide will help you get started.

## Quick Links

- [Report a bug](https://github.com/dreamiurg/shipmate/issues/new)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Semantic Versioning](https://semver.org/)

## Local Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/shipmate.git
   cd shipmate
   ```

2. **Symlink to Claude Plugins Directory**

   ```bash
   mkdir -p ~/.claude/plugins
   ln -s /path/to/shipmate ~/.claude/plugins/shipmate

   # Verify
   ls -la ~/.claude/plugins/shipmate
   ```

3. **Restart Claude Code**

   ```bash
   # Close and restart Claude, then verify:
   claude
   > /plugin list
   ```

4. **Configure Commit Template** (optional)

   ```bash
   git config commit.template .gitmessage
   ```

## Development Workflow

1. Create a branch: `git checkout -b your-feature-name`
2. Make changes (follow existing code style)
3. Test thoroughly with different GitHub scopes and activity patterns
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
5. Push and create PR

## Testing Changes

After modifying files in your local checkout:

1. Copy updated files to `~/.claude/`:

   ```bash
   cp skills/shipmate:end-of-day-summary/SKILL.md ~/.claude/skills/shipmate:end-of-day-summary/
   cp agents/*.md ~/.claude/agents/
   ```

2. Test with the skill:

   ```bash
   claude
   > Generate my end-of-day summary
   ```

3. Test edge cases:
   - No GitHub activity in last 24 hours
   - Multiple GitHub organizations
   - Different configuration options
   - Integration with Notion (if configured)

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). See [.gitmessage](.gitmessage) if available for examples.

**Triggers release:**

- `feat:` - New feature (minor bump)
- `fix:` - Bug fix (patch bump)
- `perf:` - Performance improvement (patch bump)
- `feat!:` or `fix!:` - Breaking change (major bump)

**No release:**

- `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, `build:`

**Format:**

```text
<type>: <description>

[optional body]

[optional footer]
```

## Pull Requests

**Before submitting:**

- [ ] Code follows existing patterns
- [ ] Tested with multiple GitHub activity scenarios
- [ ] Documentation updated (README, skill docs, agent docs)
- [ ] PR title follows format: `type: description`
- [ ] Configuration examples updated if needed

**PR title must use Conventional Commits format** - GitHub Action validates this.

## Project Structure

```text
shipmate/
├── .claude-plugin/          # Plugin metadata
├── skills/                  # Skill definitions
│   └── shipmate:end-of-day-summary/
├── agents/                  # Agent definitions
│   ├── github-analyzer-agent.md
│   └── summarizer-agent.md
├── integrations/            # Integration guides
│   └── notion/
├── scripts/                 # Build and release scripts
├── .github/workflows/       # CI/CD
└── README.md               # Main docs
```

## Getting Help

- [Issues](https://github.com/dreamiurg/shipmate/issues)
- [Example Output](README.md#example-output)
- [Skill Documentation](skills/shipmate:end-of-day-summary/SKILL.md)
- [Claude Code Docs](https://docs.claude.com/claude-code)

## What to Contribute

We welcome:

- Bug fixes
- New integration support (Slack, Discord, etc.)
- Better activity analysis and theme detection
- Summary format improvements
- Documentation improvements
- Configuration enhancements
- Claude Code session correlation improvements

Thank you for contributing!
