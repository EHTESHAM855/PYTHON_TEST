import hmac
import os
from datetime import timedelta

from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)

# Set SESSION_SECRET in Vercel Environment Variables before deployment.
# The fallback is for local development only.
app.secret_key = os.environ.get("SESSION_SECRET", "local-dev-only-change-this-secret")

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("VERCEL") == "1",
    PERMANENT_SESSION_LIFETIME=timedelta(hours=8),
)


def is_authenticated():
    return session.get("assessment_authenticated") is True


@app.route("/", methods=["GET", "POST"])
def home():
    configured_password = os.environ.get("ASSESSMENT_PASSWORD")

    if not configured_password:
        return render_template("setup_error.html"), 500

    if request.method == "POST":
        submitted_password = request.form.get("password", "")
        if hmac.compare_digest(submitted_password, configured_password):
            session.clear()
            session["assessment_authenticated"] = True
            session.permanent = True
            return redirect(url_for("assessment"))

        flash("Incorrect password. Please try again.", "error")
        return render_template("login.html"), 401

    if is_authenticated():
        return redirect(url_for("assessment"))

    return render_template("login.html")


@app.get("/assessment")
def assessment():
    if not is_authenticated():
        return redirect(url_for("home"))

    response = app.make_response(render_template("index.html"))
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
    response.headers["Pragma"] = "no-cache"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "same-origin"
    return response


@app.post("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


@app.get("/health")
def health():
    return {"status": "ok"}


# Vercel imports this Flask app from app.py.
