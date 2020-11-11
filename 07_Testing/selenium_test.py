import os
import pathlib 
import unittest 

from selenium import webdriver 




def file_uri(filename):
    return pathlib.Path(os.path.abspath(filename)).as_uri()


driver = webdriver.Chrome()


class WebPageTests(unittest.TestCase):

    def test_title(self):
        driver.get(file_uri("counter.html"))
        self.assertEqual(driver.title, "Counter")

    def test_increase(self):
        increase = driver.find_element_by_id("assert")
        increase.click()


    def test_decrease(self):
        driver.get(file)
        self.assertEqual(driver.find_element_by_id("decrease"))
        



