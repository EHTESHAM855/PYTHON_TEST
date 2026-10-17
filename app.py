from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/health")
def health():
    return jsonify({"status": "ok", "app": "Python Diagnostic Assessment"})

# Vercel's Python runtime imports this WSGI app.
