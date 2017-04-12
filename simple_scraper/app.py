import os
from flask import Flask, request, render_template, jsonify
import scrap
import driver

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scrap", methods=["POST"])
def formSubmit():
    q = request.form.get("q")
    imgLinks = scrap.getDribbblePhotos(q)
    # imgLinks = driver.webdriverSearch(q)

    return render_template("images.html", links=imgLinks, q=q)

if __name__ == "__main__":
     app.debug = True
     port = int(os.environ.get("PORT", 5000))
     app.run(host='0.0.0.0', port=port)
