# Claude Code Session Integration

## Overview

Shipmate enriches end-of-day summaries with Claude Code session data to reveal the depth of work behind commits and PRs.

A one-line bug fix might represent hours of debugging across multiple Claude sessions. Session integration makes this visible.

## How It Works

1. **Extract sessions**: Parse `~/.claude/projects/` for sessions in the last 24 hours
2. **Correlate with GitHub**: Match sessions to commits/PRs by project path and time proximity
3. **Enrich summaries**: Weave session insights naturally into the narrative

## Configuration

```yaml
claude_sessions:
  enabled: true                    # Toggle feature on/off
  time_window_hours: 24            # Match GitHub's 24-hour window
  correlation_window_hours: 2      # Sessions within ±2 hours of commits match
  min_duration_minutes: 2          # Ignore very short sessions
```

## Examples

### Before (without sessions)

> Fixed authentication bug in user service

### After (with 90-minute debugging session)

> Fixed authentication bug in user service after deep debugging session tracking down token refresh logic

### Orphaned Sessions (investigation without commits)

> Investigated performance bottlenecks in the API gateway, exploring caching strategies and query optimization approaches

## Privacy

- Only reads session metadata (timestamps, project paths, first message)
- Never analyzes full transcript content
- Session data stays local (not sent to external services)

## Troubleshooting

**No sessions appear:**
- Check `~/.claude/projects/` exists and contains `.jsonl` files
- Verify `enabled: true` in config
- Check time window (default 24 hours)

**Wrong sessions matched:**
- Adjust `correlation_window_hours` (default: 2)
- Sessions match by project path + time proximity

**Too many sessions:**
- Increase `min_duration_minutes` (default: 2)
- Sessions under threshold are filtered out
