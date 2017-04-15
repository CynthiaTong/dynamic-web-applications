from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import subprocess
import time

def webdriverSearch(q):

    driver = webdriver.Firefox()
    driver.get('https://www.dribbble.com')
    searcher = driver.find_element_by_css_selector(".search-text")

    # clear the placeholder
    searcher.clear()
    searcher.send_keys(q)
    searcher.submit()
    # searcher.send_keys(Keys.RETURN);
    time.sleep(2)

    SCROLL_PAUSE_TIME = 0.2

    ### http://stackoverflow.com/questions/20986631/how-can-i-scroll-a-web-page-using-selenium-webdriver-in-python
    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(SCROLL_PAUSE_TIME)

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    items = driver.find_elements_by_css_selector(".dribbble-link picture source")
    # print(items)
    output = []

    for item in items:
        src = item.get_attribute("srcset")
        if "teaser" not in src:
            output.append(src)

    driver.quit()

    return output

if __name__ == "__main__":
    webdriverSearch(sys.argv[1])
