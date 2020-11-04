from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new_listing, name="new"),
    path("<int:id>", views.listing_view, name="listing"),
    path("users/<str:username>", views.user_page, name="user_page"),
    path("add_bid/<int:id>", views.add_bid, name="add_bid"),
    path('update_bid/<int:id>', views.update_bid, name="update_bid"),
    path("update_watchlist/<int:id>", views.update_watchlist, name="update_watchlist")
]
