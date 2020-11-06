from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new_listing, name="new"),
    path("<int:id>", views.listing_view, name="listing"),
    path("<str:username>", views.user_page, name="user_page"),
    path("<str:username>/watchlist", views.watchlist, name="watchlist"),
    path("<str:username>/bids", views.bids, name="user_bids"),
    path("search/categories/<str:category>", views.search_category, name="category")

]
