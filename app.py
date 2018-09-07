from flask import Flask, render_template, request, jsonify
import requests
import json

# ---------- Variables ----------
app = Flask(__name__)


# ---------- Routes ----------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/ca")
def ca():
    """ 1D Cellular Automaton """
    return render_template("ca.html")


@app.route("/lifegame")
def lifegame():
    """ Conway's Game of Life """
    return render_template("lifegame.html")


@app.route("/road_direction")
def road_direction():
    """ Road direction histogram """
    return render_template("road_direction.html")


@app.route("/road_geojson")
def road_geojson():
    """ Get GeoJSON of road """
    endpoint = "https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/16/{x}/{y}.geojson"
    response = requests.get(endpoint.format(
        x = request.args.get("x"),
        y = request.args.get("y")
    ))
    return jsonify(json.loads(response.text))


@app.route("/lsystem")
def lsystem():
    """ L-system """
    return render_template("lsystem.html")
