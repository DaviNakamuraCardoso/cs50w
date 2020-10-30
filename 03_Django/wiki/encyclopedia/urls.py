from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:page>", views.pages, name="definitions"),
    path("error/<str:not_found>", views.error, name="error"),
    path("search/", views.search, name="search"),
    path("new/", views.new, name="new"),
    path("random/", views.random_page, name="random")
]
