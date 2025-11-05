# Notion Integration

This integration posts your daily summaries to a Notion Daily Log page.

## Setup

### 1. Create a Daily Log Page in Notion

1. Open Notion and create a new page called "Daily Log"
2. Add any structure you want - the integration will add entries at the top
3. Copy the page URL from your browser

### 2. Configure Shipmate

Edit your `shipmate.yaml` configuration file:

```yaml
integrations:
  notion:
    enabled: true
    daily_log_url: "https://www.notion.so/your-workspace/Daily-Log-abc123"
```

### 3. Ensure Notion MCP is Connected

Shipmate uses Claude Code's Notion MCP integration. Make sure:

1. You have the Notion MCP server configured in Claude Code
2. You've authenticated with your Notion workspace
3. The bot has access to your Daily Log page

Test by running: `/shipmate:eod`

## Output Format

The integration posts summaries with this structure:

```markdown
## November 4, 2025

### What I accomplished today

- **Major Topic 1** - Description of what you accomplished
 - [Link to documentation](https://github.com/...)
 - [Link to PR](https://github.com/...)
- **Major Topic 2** - Description
 - [Link to issue](https://github.com/...)
- **Housekeeping** - Brief list of smaller tasks
```

## Customization

To customize the format:

1. Edit `skills/shipmate:end-of-day-summary/SKILL.md` Step 9
2. Modify the markdown template to match your preferences
3. Adjust the bullet structure, heading levels, or content

## Troubleshooting

**"Failed to post to Notion":**

- Verify the `daily_log_url` is correct
- Check that Notion MCP is authenticated
- Ensure the page isn't locked or in a private space

**"Cannot find page":**

- Copy the full page URL from your browser
- Make sure you're using the full URL including the page ID

**Format looks wrong:**

- Check that your Daily Log page isn't using a database view
- This integration works best with regular Notion pages
