<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Coolify Deployment Monitoring
When deploying code to Coolify or debugging a failed deployment:
1. **Never assume success:** Do not blindly assume a fix worked just because a local build succeeded.
2. **Autonomous Verification:** If the user provides a Coolify deployment or log URL, or asks you to check the deployment, you MUST use the  rowser_subagent to open the URL, read the runtime/deployment logs, and debug the issue yourself.
3. **Continuous Monitoring:** Continue fixing, pushing, and checking the logs autonomously until the deployment turns green, without forcing the user to copy-paste error messages.

## Git Workflow
- **Always Commit & Push to GitHub:** Setiap kali selesai melakukan perbaikan, penambahan fitur, atau modifikasi file pada kode, WAJIB langsung lakukan commit dengan pesan yang deskriptif dan push ke remote repository (`git push origin main`).
- **CRITICAL INVARIANT:** Agent TIDAK BOLEH mengakhiri percakapan/turn setelah melakukan perubahan kode sebelum menjalankan `git add .`, `git commit -m "..."`, dan `git push origin main`. Verifikasi selalu dengan `git status` sebelum membalas user.

## Core Product Focus Rule
- **No Free Tier / Tab Limit Discussions:** Seluruh 8 modul/tab utama (Planner, Habits, Finance, Journal, Goals, Jobs, Study, Calendar) terbuka penuh secara default. JANGAN PERNAH membahas lagi skema "Free Tier" atau "3-Tab limit".
- **Feature Analysis & Implementation Focus:** Fokuskan analisis dan pengerjaan 100% pada inventarisasi, pengembangan, dan perbaikan fitur di setiap tab berdasarkan berkas kode sesungguhnya.

## No Command Polling Loops After Deployment
**CRITICAL:** Setelah `git push` atau men-trigger Coolify deployment, **JANGAN polling status dalam loop**.
- Cek status deployment **maksimal 2 kali**, lalu **berhenti dan lapor ke user**.
- User akan memberitahu jika ada error. Loop commands sangat mengganggu dan membuang waktu.
- Contoh yang DILARANG: terus-menerus menjalankan `SELECT status FROM application_deployment_queues` atau `docker ps` dalam loop puluhan kali.
- Contoh yang BENAR: Cek sekali setelah push, lapor hasilnya, stop.

## Docker npm exit code 127 — Root Cause
Saat `npm install` atau `npm ci` gagal dengan **exit code 127** di Coolify/Docker build:
- **ROOT CAUSE PERTAMA YANG HARUS DICEK:** npm lifecycle scripts (`prepare`, `postinstall`, dll) yang memanggil binary eksternal (seperti `git`, `curl`) yang **tidak tersedia di Docker container**.
- **BUKAN** masalah PATH atau npm tidak ada.
- Error signature: `sh: git: not found` atau `sh: <binary>: not found` di output npm.
- **Fix:** Bungkus lifecycle script dengan Node.js try/catch:
  ```json
  "prepare": "node -e \"try { require('child_process').execSync('git config core.hooksPath .githooks', { stdio: 'ignore' }); } catch (e) {}\""
  ```

## Container-Safe npm prepare Scripts
Setiap `prepare` script di project ini yang memanggil `git` atau binary eksternal **WAJIB** dibungkus agar tidak crash di CI/Docker environment:
- Jangan: `"prepare": "git config core.hooksPath .githooks"` ← crash di Docker karena git tidak ada
- Boleh: `"prepare": "node -e \"try{...}catch(e){}\""` ← aman di semua environment
- Alternatif: Cek environment dulu: `if (process.env.CI) process.exit(0);`
