"""Declarative tool schemas for GitLab MCP."""

TOOL_SCHEMAS = [
    {
        "name": "list_repos",
        "description": "List accessible GitLab repositories.",
        "input_schema": {},
    },
    {
        "name": "get_repo_structure",
        "description": "Get top-level repo structure.",
        "input_schema": {"repo": "string"},
    },
]
