#!/usr/bin/env bash
#
# Fetch GitHub activity data for the last 24 hours
#
# Usage: ./fetch-github-activity.sh <scope> <username> [org_name]
#   scope: "personal", "org", or "all"
#   username: GitHub username for filtering
#   org_name: Organization name (required if scope is "org")
#
# Outputs JSON to stdout with commits, issues, and PRs

set -euo pipefail

SCOPE="${1:-all}"
USERNAME="${2:-$(gh api user --jq '.login')}"
ORG_NAME="${3:-}"

# Calculate 24 hours ago in UTC
SINCE=$(date -u -v-24H +%Y-%m-%dT%H:%M:%SZ)

# Function to run query and handle errors
run_query() {
  local query_name="$1"
  shift
  local output
  if output=$("$@" 2>&1); then
    echo "$output"
  else
    echo "[]"
  fi
}

# Determine query filters based on scope
case "$SCOPE" in
  personal)
    COMMITS=$(run_query "commits" gh search commits --author @me --committer-date ">=$SINCE" --json commit,repository,sha,author,committer --limit 100 | jq "[.[] | select(.repository.owner.login == \"$USERNAME\")]")
    ISSUES_CREATED=$(run_query "issues-created" gh search issues --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100 | jq "[.[] | select(.repository.owner.login == \"$USERNAME\")]")
    ISSUES_CLOSED=$(run_query "issues-closed" gh search issues --author @me --closed ">=$SINCE" --json number,title,state,url,repository,closedAt --limit 100 | jq "[.[] | select(.repository.owner.login == \"$USERNAME\")]")
    PRS_CREATED=$(run_query "prs-created" gh search prs --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100 | jq "[.[] | select(.repository.owner.login == \"$USERNAME\")]")
    PRS_UPDATED=$(run_query "prs-updated" gh search prs --author @me --updated ">=$SINCE" --json number,title,state,url,repository,updatedAt --limit 100 | jq "[.[] | select(.repository.owner.login == \"$USERNAME\")]")
    ;;
  org)
    if [[ -z "$ORG_NAME" ]]; then
      echo '{"error": "org_name required for org scope"}' >&2
      exit 1
    fi
    COMMITS=$(run_query "commits" gh search commits --owner "$ORG_NAME" --author @me --committer-date ">=$SINCE" --json commit,repository,sha,author,committer --limit 100)
    ISSUES_CREATED=$(run_query "issues-created" gh search issues --owner "$ORG_NAME" --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100)
    ISSUES_CLOSED=$(run_query "issues-closed" gh search issues --owner "$ORG_NAME" --author @me --closed ">=$SINCE" --json number,title,state,url,repository,closedAt --limit 100)
    PRS_CREATED=$(run_query "prs-created" gh search prs --owner "$ORG_NAME" --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100)
    PRS_UPDATED=$(run_query "prs-updated" gh search prs --owner "$ORG_NAME" --author @me --updated ">=$SINCE" --json number,title,state,url,repository,updatedAt --limit 100)
    ;;
  all)
    COMMITS=$(run_query "commits" gh search commits --author @me --committer-date ">=$SINCE" --json commit,repository,sha,author,committer --limit 100)
    ISSUES_CREATED=$(run_query "issues-created" gh search issues --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100)
    ISSUES_CLOSED=$(run_query "issues-closed" gh search issues --author @me --closed ">=$SINCE" --json number,title,state,url,repository,closedAt --limit 100)
    PRS_CREATED=$(run_query "prs-created" gh search prs --author @me --created ">=$SINCE" --json number,title,state,url,repository --limit 100)
    PRS_UPDATED=$(run_query "prs-updated" gh search prs --author @me --updated ">=$SINCE" --json number,title,state,url,repository,updatedAt --limit 100)
    ;;
  *)
    echo '{"error": "invalid scope - must be personal, org, or all"}' >&2
    exit 1
    ;;
esac

# Output combined JSON
jq -n \
  --argjson commits "$COMMITS" \
  --argjson issues_created "$ISSUES_CREATED" \
  --argjson issues_closed "$ISSUES_CLOSED" \
  --argjson prs_created "$PRS_CREATED" \
  --argjson prs_updated "$PRS_UPDATED" \
  --arg since "$SINCE" \
  '{
    commits: $commits,
    issues_created: $issues_created,
    issues_closed: $issues_closed,
    prs_created: $prs_created,
    prs_updated: $prs_updated,
    metadata: {
      query_timestamp: (now | strftime("%Y-%m-%dT%H:%M:%SZ")),
      time_window_hours: 24,
      since: $since,
      scope: $ARGS.positional[0]
    }
  }' \
  --args "$SCOPE"
