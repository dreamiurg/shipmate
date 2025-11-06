# Contributing

## Testing Changes Locally

### Prerequisites

- [Claude Code](https://docs.claude.com/claude-code) installed
- [GitHub CLI (`gh`)](https://cli.github.com/) authenticated
- Node.js (for session parser script)

### Setup

1. **Clone the repository:**

```bash
git clone https://github.com/dreamiurg/shipmate.git
cd shipmate
```

2. **Symlink to Claude Code skills directory:**

```bash
ln -s "$(pwd)/skills/eod" ~/.claude/skills/shipmate-eod
```

3. **Restart Claude Code** to load the skill.

4. **Create test configuration:**

```bash
# Create project-specific config
mkdir -p .claude
cat > .claude/shipmate.yaml << 'EOF'
github_scope: personal

claude_sessions:
  enabled: true
  time_window_hours: 24
  correlation_window_hours: 2
  min_duration_minutes: 2
EOF
```

5. **Test the skill:**

```bash
# In Claude Code session
"Generate my end-of-day summary"
```

6. **After making changes, restart Claude Code** to reload the skill.

### Testing Session Parser

```bash
# Test with different time windows
node scripts/parse-claude-sessions.js 24 2
node scripts/parse-claude-sessions.js 168 5  # 7 days, 5 min minimum
```

### Verify Agent Files

```bash
# Agent definitions are in agents/
ls agents/claude-analyzer-agent.md
ls agents/github-analyzer-agent.md
ls agents/summarizer-agent.md

# Skill definition
ls skills/eod/SKILL.md
```

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
