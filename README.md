# Shipmate

[![Release Version](https://img.shields.io/github/v/release/dreamiurg/shipmate)](https://github.com/dreamiurg/shipmate/releases/latest)
[![CI](https://github.com/dreamiurg/shipmate/actions/workflows/ci.yml/badge.svg)](https://github.com/dreamiurg/shipmate/actions/workflows/ci.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Your daily dev sidekick for tracking what you ship

Shipmate is a [Claude Code](https://docs.claude.com/claude-code) plugin that generates conversational end-of-day summaries from your GitHub activity. Perfect for team standups, personal logs, or just remembering what you accomplished today.

```markdown

 ▐▛███▜▌   Claude Code v2.0.34
▝▜█████▛▘  Sonnet 4.5 · Claude Max
  ▘▘ ▝▝    /tmp

> Generate my end-of-day summary

⏺ I'm using the shipmate:eod skill to generate an end-of-day summary.
⏺ I'll generate your end-of-day summary. Let me start by creating a task list to track our
  progress.
⏺ Now let me detect your GitHub organizations and username.

...

⏺ User answered Claude's questions:
  ⎿  · Which GitHub activity would you like to include in your end-of-day summary? → Personal
     account only (dreamiurg)

⏺ shipmate:github-analyzer-agent(Extract GitHub activity data)
  ⎿  Done (7 tool uses · 26.6k tokens · 1m 42s)

⏺ User answered Claude's questions:
  ⎿  · Which topics should be highlighted as main accomplishments? (Select 2-4. Everything else
     will be grouped as 'Housekeeping') → Fixed Shipmate plugin naming and registration issues,
     Wrote blog post about Shipmate development

⏺ shipmate:summarizer-agent(Generate conversational summary)
  ⎿  Done (0 tool uses · 6.4k tokens · 13.5s)

⏺ Here's your end-of-day summary:
Daily Update - November 5, 2025

- **Fixed Shipmate plugin naming and registration issues** - Spent some time debugging why the Shipmate
plugin kept triple-invoking itself. Turns out Claude Desktop’s plugin system auto-prefixes skill
names with the plugin name, so having both a slash command AND a skill with overlapping names was
causing conflicts. The skill was being called three different ways at once. Fixed it by removing the
slash command entirely and renaming the skill directory to match the expected registration name. Also
had to chase down a bunch of related issues - duplicate namespace prefixes, incorrect script paths
after the directory rename, and the version footer not updating properly. Got it all working and
released version 1.1.8 (https://github.com/dreamiurg/shipmate/releases/tag/v1.1.8)

- **Wrote blog post about Shipmate development** - Documented the journey of building the Shipmate
end-of-day summary skill, from initial idea through the naming issues I ran into today. Focused on
the process and what I learned about Claude Desktop’s plugin system - how it handles skill
registration, the auto-prefixing behavior, and why slash commands can collide with skill names. Also
added a style guide to my blog that emphasizes intellectual honesty and process-focused narrative,
inspired by writing principles of the blog authors I follow.

- **Housekeeping** - Set up pre-commit hooks for several repos (gitleaks for secrets, markdownlint for
documentation quality, conventional commits for PR titles), added CI workflow to Shipmate with
badges for build status and latest release, configured branch protection, updated documentation to
reference the main branch instead of master, and cleaned up some stale tool version files.
```

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

Ask Claude to generate your end-of-day summary:

```text
"Generate my end-of-day summary"
```

Or directly invoke the skill using the Skill tool:

```text
Use the shipmate:eod skill
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
- **Claude Code Session Integration** - Reveals depth of work behind commits by correlating with Claude Code session history
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

# Claude Code Session Integration
claude_sessions:
  enabled: true                    # Enable Claude Code session integration
  time_window_hours: 24            # How far back to look for sessions
  correlation_window_hours: 2      # Time proximity for matching sessions to commits
  min_duration_minutes: 2          # Ignore sessions shorter than this

# Enable integrations
integrations:
  notion:
    enabled: true
    daily_log_url: "https://www.notion.so/your-workspace/Daily-Log-abc123"
```

See [Claude Sessions Documentation](docs/CLAUDE_SESSIONS.md) for details.

## Integrations

### Notion

Post your daily summary to a Notion Daily Log page. See [integrations/notion/README.md](integrations/notion/README.md) for setup instructions.

### Coming Soon

- **Slack** - Post to team channels
- **Markdown** - Save to local files
- **Discord** - Share with communities

## How It Works

Shipmate uses two specialized agents:

1. **github-analyzer-agent** (Haiku)
   - Runs parallel GitHub CLI queries
   - Extracts commits, issues, PRs from last 24 hours
   - Returns structured JSON data

2. **summarizer-agent** (Sonnet)
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

Edit `agents/summarizer-agent.md` to customize:

- Tone and style
- Output structure
- What details to include/exclude

### Change Data Sources

Edit `agents/github-analyzer-agent.md` to:

- Add more GitHub queries
- Include different time ranges
- Filter by labels or other criteria

### Add New Integrations

1. Create `integrations/<name>/README.md` with setup instructions
2. Add integration config to `config.example.yaml`
3. Update `skills/shipmate:end-of-day-summary/SKILL.md` Step 8 to handle the new integration

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

```text
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
│   └── shipmate:end-of-day-summary/
│       └── SKILL.md                   # Main orchestration skill
├── agents/
│   ├── github-analyzer-agent.md   # Data extraction
│   └── summarizer-agent.md        # Summary writing
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
   cp skills/shipmate:end-of-day-summary/SKILL.md ~/.claude/skills/shipmate:end-of-day-summary/
   cp agents/*.md ~/.claude/agents/
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
