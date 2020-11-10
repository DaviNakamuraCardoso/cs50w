
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("pages/<int:page>", views.get_page, name="get_page"), 
    path("my_profile", views.get_current_user, name="my_page"), 
    path("like", views.like_post, name="like_post"), 
    path("post", views.new_post, name="post"), 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
