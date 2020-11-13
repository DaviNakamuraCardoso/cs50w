
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # Authentication 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"), 
    path("current_user", views.current_user, name="current_user"), 

    # APIs for pages 
    path("pages/<int:page>", views.get_page, name="get_page"), 
    path("users/<str:username>", views.get_user, name="user_page"), 

    # APIs for posts
    path("user_posts/<str:username>/<int:page>", views.user_posts, name="user_posts"), 
    path("posts/<int:post_id>", views.get_post, name="get_post"), 
    path("post", views.new_post, name="post"), 


    # APIs for liking and following
    path("like_post/<int:post_id>", views.like_post, name="like_post"), 
    path("follow/<str:username>", views.follow_user, name="follow_user")
    ]
