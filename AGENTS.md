<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Coolify Deployment Monitoring
When deploying code to Coolify or debugging a failed deployment:
1. **Never assume success:** Do not blindly assume a fix worked just because a local build succeeded.
2. **Autonomous Verification:** If the user provides a Coolify deployment or log URL, or asks you to check the deployment, you MUST use the rowser_subagent to open the URL, read the runtime/deployment logs, and debug the issue yourself.
3. **Continuous Monitoring:** Continue fixing, pushing, and checking the logs autonomously until the deployment turns green, without forcing the user to copy-paste error messages.
