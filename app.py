from flask import Flask, render_template


# ---------- Variables ----------
app = Flask(__name__)


# ---------- Routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ca")
def ca():
    return render_template("ca.html")

@app.route("/lifegame")
def lifegame():
    return render_template("lifegame.html")
