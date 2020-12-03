from django.test import TestCase, Client
from selenium import webdriver 

# Create your tests here.
class IndexTestCase(TestCase):

    def setUp(self):
        pass 
        
    def test_index(self):
        """
        Check if its possible to access the index page
        """

        # Setting up a client  
        client = Client()

        # Make a get request to the site
        response = client.get("")

        # Make sure the request is successful 
        self.assertEqual(response.status_code, 200)


