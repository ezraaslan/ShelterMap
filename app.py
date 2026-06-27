from flask import Flask, render_template, jsonify
from database import get_all_shelters

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/resources")
def resources():
    return jsonify(get_all_shelters())

if __name__ == "__main__":
    app.run(debug=True)