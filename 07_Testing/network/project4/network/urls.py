
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("pages/<int:page>", views.get_page, name="get_page"), 
    path("users/<str:username>", views.user_page, name="user_page"), 
    path("user_posts/<str:username>/<int:page>", views.user_posts, name="user_posts"), 
    path("like_post/<int:post_id>", views.like_post, name="like_post"), 
    path("posts/<int:post_id>", views.get_post, name="get_post"), 
    path("current_user", views.current_user, name="current_user"), 
    path("post", views.new_post, name="post"), 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
