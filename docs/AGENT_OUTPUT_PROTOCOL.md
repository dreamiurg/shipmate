# Agent Output Protocol

All shipmate agents must follow this standardized output protocol for consistency and reliability.

## Output Requirements

1. **Primary Output**: JSON structure returned in agent's final message
2. **Error Handling**: Never fail - always return valid JSON even on error
3. **Consistency**: Use standardized field names and structures

## Standard Response Format

All agents should return JSON with this structure:

```json
{
  "data": {
    /* Agent-specific data */
  },
  "metadata": {
    /* Query parameters and result counts */
  },
  "status": "success"  /* or "partial" if some data sources failed */
}
```

## Agent-Specific Formats

### GitHub Analyzer Agent

**Success:**
```json
{
  "commits": [ /* array of commit objects */ ],
  "issues": [ /* array of issue objects */ ],
  "prs": [ /* array of PR objects */ ],
  "metadata": {
    "query_timestamp": "2025-11-08T06:09:22Z",
    "scope": "personal",
    "time_window_hours": 24,
    "total_commits": 15,
    "total_issues": 3,
    "total_prs": 2
  }
}
```

### Claude Analyzer Agent

**Success:**
```json
{
  "sessions": [
    {
      "session_id": "abc123",
      "project_path": "/Users/user/project",
      "start_time": "2025-11-08T10:00:00Z",
      "end_time": "2025-11-08T11:30:00Z",
      "duration_minutes": 90,
      "message_count": 45,
      "summary": "Debug authentication bug",
      "tool_usage": {
        "file_edits": 3,
        "bash_commands": 12,
        "reads": 8
      }
    }
  ],
  "metadata": {
    "time_window_hours": 24,
    "min_duration_minutes": 2,
    "total_sessions": 1
  }
}
```

**Empty result (no sessions found):**
```json
{
  "sessions": [],
  "metadata": {
    "time_window_hours": 24,
    "min_duration_minutes": 2,
    "total_sessions": 0
  }
}
```

### Correlation Agent

**Success:**
```json
{
  "enriched_activities": [
    {
      "type": "commit",
      "message": "Fix bug",
      "timestamp": "2025-11-08T15:00:00Z",
      "repo": "myapp",
      "sha": "abc123",
      "related_sessions": [
        {
          "session_id": "xyz789",
          "duration_minutes": 90,
          "summary": "Debug issue",
          "message_count": 45,
          "tool_usage": {
            "file_edits": 3,
            "bash_commands": 12,
            "reads": 8
          }
        }
      ]
    }
  ],
  "orphaned_sessions": [
    /* Sessions without matching GitHub activity */
  ],
  "metadata": {
    "total_activities": 15,
    "activities_with_sessions": 8,
    "total_sessions": 10,
    "orphaned_sessions": 2,
    "correlation_window_hours": 2
  }
}
```

### Summarizer Agent

**Success:**
```markdown
# Daily Update - November 8, 2025

**What I accomplished today:**

- **Main accomplishment 1** - Description with links
- **Main accomplishment 2** - Description with links
- **Housekeeping** - Minor tasks grouped together
```

## Error Handling

Agents must handle errors gracefully and return valid JSON:

**Example - Missing directory:**
```json
{
  "sessions": [],
  "metadata": {
    "time_window_hours": 24,
    "min_duration_minutes": 2,
    "total_sessions": 0,
    "note": "~/.claude/projects/ directory not found"
  }
}
```

**Example - Partial failure:**
```json
{
  "commits": [ /* successful results */ ],
  "issues": [],
  "prs": [],
  "metadata": {
    "query_timestamp": "2025-11-08T06:09:22Z",
    "scope": "personal",
    "total_commits": 15,
    "total_issues": 0,
    "total_prs": 0,
    "errors": [
      "gh search issues failed: API rate limit exceeded"
    ]
  }
}
```

## Best Practices

1. **Always return valid JSON** - Never throw exceptions or return error messages as plain text
2. **Include metadata** - Help parent skills understand what was queried and what was found
3. **Use consistent field names** - Follow the patterns above
4. **Handle missing data** - Return empty arrays, not null or undefined
5. **Document units** - `time_window_hours`, `duration_minutes`, etc.
6. **Include timestamps** - ISO 8601 format (`2025-11-08T06:09:22Z`)
7. **Keep output focused** - Only include fields needed by parent skill
8. **Count results** - Include total counts in metadata
