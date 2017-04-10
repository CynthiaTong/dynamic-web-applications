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
    # imgLinks = scrap.getDribbblePhotos(q)
    imgLinks = driver.webdriverSearch(q)

    filteredLinks = []
    counter = 0

    for link in imgLinks:
        if counter % 2 == 0:
            filteredLinks.append(link)
        counter += 1

    # return jsonify(filteredLinks)

    return render_template("images.html", links=filteredLinks, q=q)

if __name__ == "__main__":
    app.run(debug=True)
