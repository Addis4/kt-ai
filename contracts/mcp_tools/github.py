"""Declarative tool schemas for GitHub MCP."""

TOOL_SCHEMAS = [
    {
        "name": "list_repos",
        "description": "List accessible GitHub repositories.",
        "input_schema": {"owner": "string", "type": "string"},
    },
    {
        "name": "get_repo_structure",
        "description": "Get repository structure and README metadata.",
        "input_schema": {"owner": "string", "repo": "string", "ref": "string", "path": "string"},
    },
    {
        "name": "get_file_content",
        "description": "Fetch raw file content.",
        "input_schema": {"owner": "string", "repo": "string", "path": "string", "ref": "string"},
    },
]
