from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

# ---------- Variables ----------
app = Flask(__name__)
CORS(app)

# ---------- Roues ----------
@app.route("/")
def hello():
    return "Hello World!"


@app.route("/road")
def road():
    """ Get GeoJSON of road for tile (16, x, y), avoiding CORS """
    # Only zoom level 16 provided
    endpoint = "https://cyberjapandata.gsi.go.jp/xyz/experimental_rdcl/16/{x}/{y}.geojson"
    response = requests.get(endpoint.format(
        x = request.args.get("x"),
        y = request.args.get("y")
    ))

    # returns empty json when requested (x, y) is not supported
    return jsonify(json.loads(response.text)) if response.ok else jsonify({})
