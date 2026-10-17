# Python Lab — Diagnostic Assessment (Flask + Vercel)

A responsive, browser-based Python diagnostic assessment for a beginner / Class 9 student. It records responses in the current browser session and generates a downloadable text report. It does **not** store answers on a server or automatically grade open-ended code.

## Project structure

```text
python_diagnostic_vercel/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── public/
    ├── app.js
    └── style.css
```

## Run locally

Requires Python 3.10+.

```bash
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
flask --app app run --debug
```

Open `http://127.0.0.1:5000`.

## Deploy to Vercel

This project uses Vercel's current zero-configuration Flask deployment conventions.

1. Extract the ZIP.
2. Upload the project files to a GitHub repository, keeping the same folder structure.
3. In Vercel, choose **Add New → Project** and import that repository.
4. Vercel should detect `app.py` as the Flask application and install `requirements.txt`.
5. Deploy, then open the provided `.vercel.app` URL.

Static assets are in `public/`, which Vercel serves from its CDN. The Flask app and template are at the project root.

Official guide: https://vercel.com/kb/guide/ship-a-flask-app-on-vercel

## What the site does

- 18 questions across Python basics, tracing, conditions, loops, debugging, independent coding, and explanation.
- Progress tracker and elapsed-time timer.
- Highlights unanswered questions.
- Builds a teacher report that can be downloaded as a text file.
- Does not show the answer key to the student.

## Important limitations

- This is a diagnostic worksheet website, not a secure exam platform.
- Answers are processed in the browser and are not uploaded to a database.
- The timer is a convenience, not proctoring.
- The site cannot prevent AI use or detect copied answers. For a meaningful diagnosis, ask the student to complete it in a supervised session and then explain or modify selected answers live.
- The website tracks completion by skill area, not correctness. Review the answers yourself before deciding which topics need work.
