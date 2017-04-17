import requests
from bs4 import BeautifulSoup
import sys

def getDribbblePhotos(q):
    links = []

    baseUrl = "https://dribbble.com/search?q=" + q

    for i in range(1,9):

        url = baseUrl + "&page=" + str(i) + "&per_page=12"
        html = requests.get(url).text
        soup = BeautifulSoup(html,"html.parser")

        images = soup.select(".dribbble-link picture source")

        for image in images:
            imgUrl = image.get("srcset")
            # print(imgUrl)
            if "teaser" not in imgUrl:
                links.append(imgUrl)

    return links

if __name__ == "__main__":
    getAmazonPhotos(sys.argv[1])
