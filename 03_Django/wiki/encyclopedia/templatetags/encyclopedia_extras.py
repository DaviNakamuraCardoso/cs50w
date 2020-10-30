from django import template
import random
import os

register = template.Library()

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)


def random_page():
    pages = []
    for filename in os.listdir('../entries'):
        pages.append(filename)

    return random.choice(pages)
