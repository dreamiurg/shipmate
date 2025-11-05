---
name: eod
description: Generate a concise end-of-day summary from GitHub activity in the last 24 hours - commits, issues, and PRs
---

# End-of-Day Summary

This skill orchestrates two specialized agents to generate a concise summary of your GitHub activity for the current day.

## What This Skill Does

1. **Extracts GitHub activity data** using the `github-analyzer-agent` agent
2. **Generates a beautiful summary** using the `summarizer-agent` agent

The result is a conversational, scannable update perfect for sharing with teammates.

## Usage

Simply invoke this skill: `/shipmate:eod` or use the Skill tool with `shipmate:eod`.

## Configuration

This skill can be configured via `shipmate.yaml` in either:

- `~/.claude/shipmate.yaml` (global)
- `<project>/.claude/shipmate.yaml` (project-specific, overrides global)

See `config.example.yaml` for configuration options.

## Process

### Step 1: Detect GitHub Organizations

Check if the user belongs to multiple organizations:

```bash
gh api user/orgs --jq '.[].login'
```

Also get the username:

```bash
gh api user --jq '.login'
```

### Step 2: Ask User for Scope

Use the AskUserQuestion tool to ask:

**Question:** "Which GitHub activity would you like to include in your end-of-day summary?"

Options:

- **Personal account only** ({username})
- **Organization: {org_name}** (one option per org discovered)
- **All accounts** (personal + all organizations)

Store the user's selection.

### Step 3: Invoke GitHub Analyzer Agent

Use the Task tool to invoke the `shipmate:github-analyzer-agent` agent (subagent_type="shipmate:github-analyzer-agent"):

```text
Please extract GitHub activity data for the last 24 hours with the following scope: [user's selection from Step 2]

Return structured data including:
- All commits with messages, repositories, timestamps
- Issues created and closed (with full issue bodies)
- Pull requests created and updated

Use parallel queries for performance.
```

**IMPORTANT**:

- Specify the exact scope (personal/org name/all)
- Request "last 24 hours"
- Ask for parallel execution
- The agent will return structured JSON data

### Step 4: Analyze Activity and Identify Key Themes

Review the data from Step 3 and identify distinct themes/topics based on:

- Issue bodies and titles (what questions were being answered?)
- Commit messages and patterns
- Repositories affected
- Type of work (investigation, feature, bugfix, tooling, etc.)

For each theme, create a clear, descriptive label like:

- "Investigated AWS infrastructure"
- "Investigated Railway deployments"
- "Investigated Auth0 setup"
- "Set up secret detection"
- "Added markdown linting"
- "Documentation improvements"

**IMPORTANT**: Identify ALL distinct themes, not just major ones. Include both substantial investigations and smaller tasks.

### Step 5: Ask User to Select Main Topics

Use the AskUserQuestion tool with multiSelect enabled:

**Question:** "Which topics should be highlighted as main accomplishments? (Select 2-4. Everything else will be grouped as 'Housekeeping')"

**Options**: Create one option for each theme identified in Step 4, ordered by estimated importance/time spent (most significant first)

Example:

```text
- "Investigated AWS infrastructure" - "Documented IAM setup, S3 buckets, VPC config, and admin access"
- "Investigated Railway deployments" - "Found two projects, identified active vs inactive deployments"
- "Set up secret detection" - "Added pre-commit hooks with gitleaks to prevent credential leaks"
- "Added markdown linting" - "Configured markdownlint-cli2 with auto-fix"
```

Store the user's selections (2-4 topics).

### Step 6: Invoke Activity Summarizer Agent

Use the Task tool to invoke the `shipmate:summarizer-agent` agent (subagent_type="shipmate:summarizer-agent"):

```text
Please create a team standup summary from this GitHub activity data:

[Paste the complete output from Step 3]

The user has selected these topics to highlight as main accomplishments:
[List the topics selected in Step 5]

Generate a conversational summary following the format with:
- Selected topics as separate bullets with detailed findings and insights
- All other activities grouped as "Housekeeping"
- Plain URLs to documentation artifacts
- Past tense, casual tone
```

**IMPORTANT**:

- Pass the complete raw data from the analyzer agent
- Clearly indicate which topics the user selected to highlight
- Everything NOT selected should be grouped into "Housekeeping"
- The agent will return the formatted summary

### Step 7: Present Summary to User

Display the summary returned by the summarizer agent.

**Optional Polish**: If the `elements-of-style:writing-clearly-and-concisely` skill is available, you may optionally use it to polish the summary further, but the summarizer agent already applies these principles.

### Step 8: Check for Enabled Integrations

Check the `shipmate.yaml` configuration for enabled integrations under the `integrations` section.

For each enabled integration, proceed to the appropriate step:

- If `integrations.notion.enabled: true`, proceed to Step 9
- If other integrations are enabled in the future, handle them here

If no integrations are enabled, you're done.

### Step 9: Post to Notion Daily Log (if enabled)

If Notion integration is enabled in config:

1. Get today's date in "Month Day, Year" format (e.g., "November 4, 2025")
2. Fetch the Daily Log page URL from config: `integrations.notion.daily_log_url`
3. Format the summary using the user's preferred bullet format:

```markdown
## {Date}

### What I accomplished today

- **{Topic 1}** - {Description from summary}
 - [{Link text}]({{URL}})
- **{Topic 2}** - {Description from summary}
 - [{Link text}]({{URL}})
- **{Topic 3}** - {Description from summary}
 - [{Link text}]({{URL}})
- **Housekeeping** - {Description from summary}
```

**IMPORTANT Formatting Rules**:

- Each main accomplishment is a top-level bullet with bold topic name
- Key artifacts (1-3 per topic) are nested bullets (indented with tab) under each accomplishment
- Include the most relevant links: documentation files, PRs, and issues that capture the work
- Use plain markdown links like `[Auth0 Documentation]({{URL}})` or `[PR #123]({{URL}})`
- Extract actual GitHub URLs from the summary text and raw activity data
- Prioritize comprehensive documentation links over minor commits
- The Housekeeping item does NOT have nested links unless there are specific artifacts to link

1. If the page already has content, prepend the new entry at the top (most recent first)
2. If the page is blank, just add the new entry
3. Use the `mcp__notion__notion-update-page` tool with appropriate command (`replace_content` or `insert_content_after`)

**Example of final Notion format**:

```markdown
## November 4, 2025

### What I accomplished today

- **Investigated Auth0 setup** - Dug through the whole Auth0 configuration to see what we're actually using. Found we have one production tenant with three main applications. Turns out we're using Google and Microsoft for social logins, have MFA set up but not enforced, and have a bunch of roles configured. Documented all the apps, APIs, connections, rules, hooks, and who has admin access.
 - [Auth0 Documentation]({{https://github.com/example-org/docs/blob/main/infrastructure/auth0.md}})
 - [Issue #7: Auth0 Configuration Inventory]({{https://github.com/example-org/docs/issues/7}})
- **Investigated AWS infrastructure** - Went through the AWS account to figure out what we have. Found IAM users and roles, data in S3 buckets, VPC configuration, and mapped out who has admin access. Got it all documented so we can plan the migration.
 - [AWS Documentation]({{https://github.com/example-org/docs/blob/main/infrastructure/aws.md}})
- **Investigated deployment process** - Figured out how we actually ship code to production. Frontend deploys manually, backend auto-deploys from GitHub.
 - [Deployment Process Documentation]({{https://github.com/example-org/docs/blob/main/infrastructure/deployment-process.md}})
 - [Issue #5]({{https://github.com/example-org/docs/issues/5}})
- **Housekeeping** - Set up pre-commit hooks with gitleaks to prevent secrets from leaking into the repo, added markdownlint for documentation quality.
```

## Agent Roles

### github-analyzer-agent

- **Specialty**: GitHub CLI (`gh`) expertise
- **Tools**: Bash
- **Model**: Haiku (fast, cost-effective for data extraction)
- **Output**: Structured JSON data about commits, issues, PRs

### summarizer-agent

- **Specialty**: Writing conversational, scannable summaries
- **Tools**: None (pure analysis and writing)
- **Model**: Sonnet (better at nuanced writing)
- **Output**: Formatted markdown summary ready to share

## Why Two Agents?

**Separation of Concerns**:

- **Analyzer** focuses on technical data gathering (parallel queries, timezone handling, error handling)
- **Summarizer** focuses on human communication (tone, grouping, insights)

**Optimized Models**:

- Use fast/cheap Haiku for repetitive data extraction
- Use smart Sonnet for nuanced writing and analysis

**Maintainability**:

- Each agent has a single, clear responsibility
- Can improve or swap agents independently
- Easier to test and debug

## Important Notes

- **Performance**: The analyzer agent runs all GitHub queries in parallel (~2-3 seconds total)
- **Time Range**: Last 24 hours from current time (not calendar day)
- **Scope**: Supports personal, organization-specific, or all-account views
- **Artifacts**: Includes links to documentation produced
- **Tone**: Conversational and scannable, optimized for team standups

## Error Handling

If the github-analyzer-agent fails:

- Check `gh auth status`
- Verify `gh` CLI is installed (requires 2.23.0+)
- Verify organization membership for org-scoped queries

If the summarizer-agent produces unexpected format:

- Ensure you passed complete raw data from analyzer
- Verify the analyzer included issue bodies for closed issues

## Customization

To customize:

- Edit `agents/github-analyzer-agent.md` for different data sources
- Edit `agents/summarizer-agent.md` for different summary formats
- Modify this skill to change orchestration logic
- Add new integrations in `integrations/` directory

## Example Flow

```text
User: /shipmate:eod

Skill: [Detects orgs: example-org]
Skill: [Asks user: "Personal, example-org, or all?"]
User: "example-org"

Skill: [Invokes github-analyzer-agent]
Analyzer: [Runs 5 parallel gh queries, returns JSON]

Skill: [Analyzes data, identifies themes]
Skill: [Presents themes to user with multiSelect question]
Themes identified:
  - Investigated AWS infrastructure
  - Investigated Railway deployments
  - Investigated Auth0 setup
  - Investigated deployment process
  - Set up secret detection
  - Added markdown linting
  - Documentation improvements

User: [Selects: AWS, Railway, Auth0, Deployment process]

Skill: [Invokes summarizer-agent with data + selected topics]
Summarizer: [Creates summary with 4 main bullets + Housekeeping group]

Skill: [Presents summary to user]
Skill: [Checks config for enabled integrations]
Skill: [If Notion enabled, posts to Notion Daily Log]
Skill: "Posted to Notion Daily Log!" (if applicable)
```

## Files

This skill uses:

- `agents/github-analyzer-agent.md` - Data extraction agent
- `agents/summarizer-agent.md` - Summary writing agent
- `skills/shipmate:end-of-day-summary/SKILL.md` - This orchestration skill
- `commands/shipmate:eod.md` - Slash command shortcut
- `integrations/notion/` - Optional Notion integration

---

**Version:** 1.1.1  
**Last Updated:** 2025-11-05
