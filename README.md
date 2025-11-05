# Shipmate

> Your daily dev sidekick for tracking what you ship

Shipmate generates conversational end-of-day summaries from your GitHub activity. Perfect for team standups, personal logs, or just remembering what you accomplished today.

## Installation

### Prerequisites

- [Claude Code](https://docs.claude.com/claude-code) installed
- [GitHub CLI (`gh`)](https://cli.github.com/) version 2.23.0 or higher
- GitHub CLI authenticated (`gh auth login`)

### Install Plugin

This repo contains both marketplace and plugin. To add it to Claude Code, run:

```bash
% claude
> /plugin marketplace add dreamiurg/shipmate
  ⎿  Successfully added marketplace: shipmate-marketplace

> /plugin install shipmate@shipmate-marketplace
  ⎿  ✓ Installed shipmate. Restart Claude Code to load new plugins.
```

### Verify Installation

In any Claude Code session:

```bash
"What skills are available?"
```

You should see `shipmate:eod` listed.

## Usage

Simply run the end-of-day command:

```bash
/shipmate:eod
```

The skill will:
1. Ask which GitHub scope to include (personal, org, or all)
2. Extract your activity from the last 24 hours
3. Identify themes and topics from your work
4. Ask you to select 2-4 main accomplishments
5. Generate a conversational summary
6. Optionally post to Notion (if configured)

## Features

- **Smart activity extraction** - Pulls commits, issues, and PRs from the last 24 hours
- **Conversational summaries** - Turns raw GitHub data into readable updates
- **Multi-organization support** - Track activity across personal and org accounts
- **Topic selection** - You pick what to highlight vs what's housekeeping
- **Pluggable integrations** - Post to Notion, Slack (coming soon), or save locally

## Configuration

Shipmate can be configured via `shipmate.yaml` in either:
- `~/.claude/shipmate.yaml` (global config)
- `<project>/.claude/shipmate.yaml` (project-specific, overrides global)

See [`config.example.yaml`](config.example.yaml) for all options.

### Example Configuration

```yaml
# Set default GitHub scope
github_scope: "all"  # or "personal" or "my-org-name"

# Enable integrations
integrations:
  notion:
    enabled: true
    daily_log_url: "https://www.notion.so/your-workspace/Daily-Log-abc123"
```

## Integrations

### Notion

Post your daily summary to a Notion Daily Log page. See [integrations/notion/README.md](integrations/notion/README.md) for setup instructions.

### Coming Soon

- **Slack** - Post to team channels
- **Markdown** - Save to local files
- **Discord** - Share with communities

## How It Works

Shipmate uses two specialized agents:

1. **shipmate:github-analyzer-agent** (Haiku)
   - Runs parallel GitHub CLI queries
   - Extracts commits, issues, PRs from last 24 hours
   - Returns structured JSON data

2. **shipmate:summarizer-agent** (Sonnet)
   - Analyzes activity data
   - Identifies themes and insights
   - Writes conversational summaries

This separation keeps data extraction fast and cheap while using a more capable model for nuanced writing.

## Example Output

```markdown
# Daily Update - November 4, 2025

**What I accomplished today:**

- **Investigated AWS infrastructure** - Dug through the AWS account to see what we're working with. Found the IAM setup, about 3.37 GB of data sitting in S3 buckets, VPC config, and figured out who has admin access. Got it all documented for when we migrate to a new AWS Organization (https://github.com/example-org/docs/blob/main/infrastructure/aws.md)

- **Investigated deployment process** - Figured out how we actually ship code. Frontend is manual deploys through Vercel CLI, backend auto-deploys from GitHub via Railway. Takes 2-5 minutes. (https://github.com/example-org/docs/blob/main/infrastructure/deployment-process.md)

- **Housekeeping** - Set up pre-commit hooks to prevent secrets from leaking, added markdown linting, created issue templates
```

## Customization

### Change Summary Format

Edit `agents/shipmate:summarizer-agent.md` to customize:
- Tone and style
- Output structure
- What details to include/exclude

### Change Data Sources

Edit `agents/shipmate:github-analyzer-agent.md` to:
- Add more GitHub queries
- Include different time ranges
- Filter by labels or other criteria

### Add New Integrations

1. Create `integrations/<name>/README.md` with setup instructions
2. Add integration config to `config.example.yaml`
3. Update `skills/shipmate:eod/SKILL.md` Step 8 to handle the new integration

## Troubleshooting

### "gh: command not found"

Install GitHub CLI:
```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
See https://github.com/cli/cli#installation
```

### "gh authentication required"

Authenticate with GitHub:
```bash
gh auth login
```

### "No activity found"

- Check that you've committed, created issues, or opened PRs in the last 24 hours
- Verify your GitHub scope includes the repositories where you worked
- Try `gh search commits --author @me --limit 5` to verify CLI access

### Configuration not loading

- Verify config file is at `~/.claude/shipmate.yaml` or `<project>/.claude/shipmate.yaml`
- Check YAML syntax (indentation matters!)
- Make sure file is named exactly `shipmate.yaml` (not `shipmate.yml`)

## Development

### Repository Structure

```
shipmate/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── CHANGELOG.md                       # Release history
├── package.json                       # NPM metadata for releases
├── config.example.yaml                # Configuration template
├── .claude-plugin/
│   ├── plugin.json                   # Plugin metadata
│   ├── marketplace.json              # Marketplace listing
│   └── hooks.json                    # Plugin hooks (empty)
├── skills/
│   └── shipmate:eod/
│       └── SKILL.md                   # Main orchestration skill
├── agents/
│   ├── shipmate:github-analyzer-agent.md   # Data extraction
│   └── shipmate:summarizer-agent.md        # Summary writing
├── commands/
│   └── shipmate:eod.md                # Slash command shortcut
├── integrations/
│   └── notion/
│       └── README.md                  # Notion setup guide
├── scripts/
│   └── update-versions.js            # Semantic release version updater
└── .github/
    └── workflows/
        └── release.yml               # Automated releases
```

### Release Management

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and releases.

**Commit Message Format:**
Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Test changes

**Breaking Changes:**
Add `BREAKING CHANGE:` in commit body or use `!` after type (e.g., `feat!:`) to trigger a major version bump.

**Release Process:**
1. Commit changes using conventional commit format
2. Push to `main` branch
3. GitHub Actions automatically:
   - Analyzes commits
   - Determines version bump
   - Updates version in all files
   - Generates CHANGELOG
   - Creates GitHub release
   - Tags the release

### Testing Changes

After modifying files in your local checkout:

1. Copy updated files to `~/.claude/`:
   ```bash
   cp skills/shipmate:eod/SKILL.md ~/.claude/skills/shipmate:eod/
   cp agents/shipmate:*.md ~/.claude/agents/
   ```

2. Test with `/shipmate:eod`

3. Check agent behavior independently using the Task tool in Claude Code

## Contributing

This is currently a private repository for early testing. If you have access:

1. Create a branch for your changes
2. Use conventional commit messages
3. Test thoroughly with `/shipmate:eod`
4. Open a PR with a clear description
5. Tag @dreamiurg for review

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

Created by [@dreamiurg](https://github.com/dreamiurg)

Built for [Claude Code](https://docs.claude.com/claude-code)

## Release Process

This project uses automated semantic versioning. Releases are automatically created when commits are pushed to the main branch using conventional commit format.
