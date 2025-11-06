#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Parse Claude Code session history from ~/.claude/projects/
 *
 * Usage: node parse-claude-sessions.js [time_window_hours] [min_duration_minutes]
 *
 * Outputs JSON to stdout with sessions from last N hours
 */

function parseArgs() {
  const timeWindow = parseInt(process.argv[2] || '24', 10);
  const minDuration = parseInt(process.argv[3] || '2', 10);
  return { timeWindow, minDuration };
}

function getProjectDirs() {
  const claudeDir = path.join(process.env.HOME, '.claude/projects');

  if (!fs.existsSync(claudeDir)) {
    return [];
  }

  return fs.readdirSync(claudeDir)
    .map(name => path.join(claudeDir, name))
    .filter(dir => fs.statSync(dir).isDirectory());
}

function extractProjectName(dirName) {
  // Handles formats like: -Users-dreamiurg-src-myproject
  // Converts to: /Users/dreamiurg/src/myproject
  return dirName
    .replace(/^-/, '/')
    .replace(/-/g, '/');
}

function parseSession(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(line => line.trim());

  const messages = lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(m => m);

  if (messages.length === 0) return null;

  // Find first and last messages with timestamps
  const timestampedMessages = messages.filter(m => m.timestamp);
  if (timestampedMessages.length === 0) return null;

  const firstMsg = timestampedMessages[0];
  const lastMsg = timestampedMessages[timestampedMessages.length - 1];

  // Extract session metadata
  const startTime = new Date(firstMsg.timestamp);
  const endTime = new Date(lastMsg.timestamp);
  const durationMinutes = Math.round((endTime - startTime) / 60000);

  // Get working directory from first message with cwd
  const msgWithCwd = messages.find(m => m.cwd);
  const projectPath = msgWithCwd ? msgWithCwd.cwd : null;

  // Find first user message for summary
  const firstUserMsg = messages.find(m =>
    m.type === 'user' &&
    m.message &&
    typeof m.message.content === 'string'
  );
  const summary = firstUserMsg
    ? firstUserMsg.message.content.substring(0, 100).replace(/\n/g, ' ')
    : 'No summary available';

  // Count tool usage
  const toolUsage = {
    file_edits: messages.filter(m =>
      m.message?.content?.some?.(c => c.type === 'tool_use' && c.name === 'Edit')
    ).length,
    bash_commands: messages.filter(m =>
      m.message?.content?.some?.(c => c.type === 'tool_use' && c.name === 'Bash')
    ).length,
    reads: messages.filter(m =>
      m.message?.content?.some?.(c => c.type === 'tool_use' && c.name === 'Read')
    ).length
  };

  return {
    session_id: path.basename(filePath, '.jsonl'),
    project_path: projectPath,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration_minutes: durationMinutes,
    message_count: messages.length,
    summary,
    tool_usage
  };
}

function getSessions(projectDir, cutoffTime, minDuration) {
  const sessions = [];

  try {
    const files = fs.readdirSync(projectDir)
      .filter(f => f.endsWith('.jsonl') && !f.startsWith('agent-'));

    for (const file of files) {
      const filePath = path.join(projectDir, file);
      const session = parseSession(filePath);

      if (!session) continue;

      const sessionTime = new Date(session.start_time);

      // Filter by time window and minimum duration
      if (sessionTime >= cutoffTime && session.duration_minutes >= minDuration) {
        sessions.push(session);
      }
    }
  } catch (err) {
    // Ignore errors reading project directory
  }

  return sessions;
}

function main() {
  const { timeWindow, minDuration } = parseArgs();
  const cutoffTime = new Date(Date.now() - timeWindow * 60 * 60 * 1000);

  const allSessions = [];
  const projectDirs = getProjectDirs();

  for (const projectDir of projectDirs) {
    const sessions = getSessions(projectDir, cutoffTime, minDuration);

    // Extract project name from directory
    const projectName = extractProjectName(path.basename(projectDir));

    for (const session of sessions) {
      // Override project_path if not set in session
      if (!session.project_path) {
        session.project_path = projectName;
      }
      allSessions.push(session);
    }
  }

  // Sort by start time (most recent first)
  allSessions.sort((a, b) =>
    new Date(b.start_time) - new Date(a.start_time)
  );

  console.log(JSON.stringify({ sessions: allSessions }, null, 2));
}

main();
