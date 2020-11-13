import json 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator 


from .models import User, Post, Like 


def index(request):
    return render(request, "network/index.html")
    


def get_page(request, page):
    posts = Post.objects.all().order_by("-id")[10*(page-1):page*10]
    return JsonResponse([post.serialize() for post in posts],  safe=False)



def following(request, page): 
    posts = []
    for follow in request.user.following.all():
        posts += follow.followed.posts.all().order_by("-id")
    s = sorted(posts, key= lambda i: i.id, reverse=True)
    selected = s[(page-1)*10:page*10]
    return JsonResponse([post.serialize() for post in selected], safe=False)


    


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        first_name = request.POST["first"]
        last_name = request.POST["last"]
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User(
                username=username, 
                first=first_name, 
                last=last_name, 
                password=password, 
                email=email
            )
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required 
def new_post(request):

    # Checks if the method is post 
    if request.method != 'POST':
        return JsonResponse({"error": "Need POST method"}, status=400)
    
    data = json.loads(request.body)
    text = data.get("post", "")
    user = request.user 
    post = Post(
        user=user, 
        post=text
    )
    post.save()
    return JsonResponse({"message": "Successfully posted."},  status=201)



def get_user(request, username):
    try:
        user = User.objects.get(username=username)
        return JsonResponse({"user":user.serialize()}, status=200, safe=False)
    except User.DoesNotExist: 
        return HttpResponse(status=404)



def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "Not logged."}, status=200)
    else:
        return JsonResponse(request.user.serialize(), status=200)



def user_posts(request, username, page):
    user = User.objects.get(username=username)
    posts = user.posts.all().order_by("-id")[(page-1)*10:page*10]
    return JsonResponse([post.serialize() for post in posts], status=200, safe=False)
    



@csrf_exempt 
@login_required 
def like_post(request, post_id):
    if request.method == "PUT":
        try:
            post = Post.objects.get(pk=post_id)
        except Pos.DoesNotExist:
            return JsonResponse({"message":"No such post."}, status=404)
        
        data = json.loads(request.body)
        if data.get("like") is not None:
            if data["like"]:
                request.user.like(post)
            else: 
                request.user.unlike(post)
        elif data.get("dislike") is not None: 
            if data["dislike"]:
                request.user.dislike(post)
            else: 
                request.user.undo_dislike(post)

        return JsonResponse({"result": post.serialize()}, status=204, safe=False)





def get_post(request, post_id):
    return JsonResponse({"result": Post.objects.get(pk=post_id).serialize()}, status=200)



@csrf_exempt 
@login_required
def follow_user(request, username):
    user = User.objects.get(username=username)
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("unfollow") is not None: 
            if data["unfollow"]:
                request.user.unfollow(user)                
            else:
                request.user.follow(user)
            return JsonResponse({"message": "Success"}, status=204)
        else:
            return JsonResponse({"message": "Missing unfollow argument!"}, status=400)
    else:
        return JsonResponse({"message": "Method must be PUT"})
    



@csrf_exempt 
@login_required 
def edit(request, post_id):
    try: 
        post = Post.objects.get(pk=post_id)

    # Checking the existence of the post
    except Post.DoesNotExist:
        return HttpResponse(status=404)

    # Checking if the user is the author of the post
    if request.user.username != post.user.username: 
        return HttpResponse(status=403)
    else: 
        # Checking the method
        if request.method == "POST":
            data = json.loads(request.body)
            updated_post = data.get("new_post", "") 
            post.post = updated_post
            post.save()
            return JsonResponse({"updated": updated_post}, status=201)
        else:
            return JsonResponse({"message": "Method must be POST"}, status=400)




