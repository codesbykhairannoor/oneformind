---
description: Critical agent behavioral rule regarding how to handle user reports of failure, bugs, or stuck processes.
---
# Trust User Reports Over UI Assumptions

1. **Never Dismiss User Complaints**: If a user states a process is stuck, failing, or broken, you MUST treat it as a factual reality of their experience. Do NOT dismiss their complaint as just a "UI glitch" or harmless error, even if superficial evidence (like a WebSocket error popup) suggests it might be.
2. **Investigate Before Concluding**: You must proactively verify the backend state (e.g., check server load, queued jobs, deployment logs, or test the live endpoint) before telling the user to "just refresh" or "wait it out."
3. **Acknowledge Real Impact**: Validate the user's frustration. Telling a user to ignore an error invalidates their experience and wastes their time. Take their concerns seriously.
