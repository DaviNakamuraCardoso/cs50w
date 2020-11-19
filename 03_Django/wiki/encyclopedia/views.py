from django.shortcuts import render
from django.http import HttpResponseRedirect
from django import template
from django import forms
from django.urls import reverse
from django.contrib import messages
from . import util
import markdown2
import re
import random


class NewArticle(forms.Form):
    title = forms.CharField(label="Title")
    article = forms.CharField(label="Article")


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def pages(request, page):
    if html_cont := md_parser(page):
        return render(request, "encyclopedia/definition.html", {
            "title": page,
            "body_content": html_cont
        })

    else:
        return HttpResponseRedirect(reverse("error", args=(page,)))


def error(request, not_found):
    return render(request, "encyclopedia/error.html", {
        "page":not_found
    })


def search(request):
    searched_word = request.POST['q']
    entries = util.list_entries()
    match_list = search_engine(search=searched_word, list=entries)
    if searched_word in entries:
        return HttpResponseRedirect(reverse("definitions", args=(searched_word, )))
    else:
        return render(request, "encyclopedia/search.html", {
            "results": match_list,
            "search": searched_word
        })


def new(request):

    if request.method == 'POST':
        # Getting the data 
        title = request.POST["title"]
        body = request.POST["body"]

        # Verifying the existence of both the title and the body
        if title != "" and body != "": 

            # Building the article 
            article = f'# {title}\n {body}'

            # Checking for articles with the same title
            if str(title).strip(" ") in util.list_entries():
                return render(request, "encyclopedia/new.html", {
                "file": str(title).strip(" ")
                })

            # In case there is no equal article, save the new one 
            else:

                util.save_entry(title, article)
                return HttpResponseRedirect(reverse("index"))

        # If one of the fields is null, return an error message
        else:
            return render(request, "encyclopedia/new.html", {
                "message": "Fill all the fields to publish the article!"
            })


    return render(request, "encyclopedia/new.html")


def edit(request, article):
    if request.method == 'POST':
        new_body = request.POST.get('new_article')
        new_article = f"# {article}\n {new_body}"
        util.save_entry(article, new_article)
        return HttpResponseRedirect(reverse('definitions', args=(article, )))
    return render(request, "encyclopedia/edit.html", {
        "title": article,
        "body": util.get_entry(article).strip("# " + article)
    })


def random_page(request):
    pages = util.list_entries()
    random_article = random.choice(pages)
    return HttpResponseRedirect(reverse('definitions', args=(random_article, )))




def md_parser(page):
    if md_text := util.get_entry(page):
        return markdown2.markdown(md_text)
    else:
        return False


def search_engine(search, list):
    matches = []
    re_str = r"(.*)" + search.strip(" ") + r"(.*)"
    search_re = re.compile(re_str, re.IGNORECASE)
    for word in list:
        if mo := search_re.search(word):
            matches.append(word)

    return matches






















#
