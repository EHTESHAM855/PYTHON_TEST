# Python Lab — Password-protected Flask assessment on Vercel

## Files

- `app.py` — Flask routes and server-side password/session protection
- `templates/login.html` — login page
- `templates/index.html` — your existing assessment page
- `templates/setup_error.html` — setup warning if environment variables are missing
- `requirements.txt` — Flask dependency

## Vercel environment variables

In Vercel, open **Project → Settings → Environment Variables** and add:

1. `ASSESSMENT_PASSWORD` — the password you choose for the student.
2. `SESSION_SECRET` — a long, random secret used to sign session cookies. Generate a different random value; do not reuse the assessment password.

Apply the variables to Production (and Preview if you will test preview deployments), then redeploy.

## Deploy

Keep the existing Vercel project and GitHub repository. Replace/add these files while preserving the structure, then commit and push. Vercel should redeploy automatically.

The login is at `/`. The assessment route is `/assessment` and redirects to login unless the session is authenticated. A successful login lasts up to 8 hours, after which the student must sign in again. `/logout` clears the session (POST only).

## Security notes

- The assessment HTML is served by Flask only after server-side authentication. The login page does not include the assessment or its answer key.
- The password is not stored in HTML/JavaScript; it is read from the server environment.
- This is suitable for a small private tutoring assessment, but it is not a full enterprise authentication system. There is no persistent rate-limiting store, so consider stronger rate limiting if it becomes public or sensitive.
- If an earlier version of the assessment was publicly deployed, assume its client-side answer key may already have been visible. This update protects it going forward but cannot undo prior exposure.
- Do not commit actual passwords or session secrets to GitHub.
