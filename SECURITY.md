# Security Notes

- `apps/api/config_demo.py` contains **demo-only placeholders** for credentials. Do **not** use these in production.
- Replace demo credentials with environment variables and secret managers before any public deployment.
- Revoke any shared tokens and rotate secrets if this repo is published.
