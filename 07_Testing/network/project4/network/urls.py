
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("pages/<int:page>", views.get_page, name="get_page"), 
    path("post", views.new_post, name="post"), 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
