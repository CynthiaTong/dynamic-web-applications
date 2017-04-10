import requests
from bs4 import BeautifulSoup
import sys

def getDribbblePhotos(q):
    links = []

    baseUrl = "https://dribbble.com/search?q=" + q
    html = requests.get(baseUrl).text
    soup = BeautifulSoup(html,"html.parser")

    images = soup.select(".dribbble-link picture source")

    for image in images:
        imgUrl = image.get("srcset")
        # print(imgUrl)
        links.append(imgUrl)


    return links

if __name__ == "__main__":
    getAmazonPhotos(sys.argv[1])
