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
    posts = Post.objects.all().order_by("-id")[1*(page-1):page*10]
    return JsonResponse([post.serialize() for post in posts],  safe=False)



    


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


@csrf_exempt 
@login_required 
def like_post(request):
    if request.method == "PUT":
        
        # Loading the JSON data from the JavaScript fetch
        data = json.loads(request.body)


        # Getting the post id
        post_id = data.get("id", "")
        is_dislike = data.get("dislike", "")

        # 
        user = request.user
        post = Post.objects.get(id=post_id)

        
        if not is_dislike:
            user.like(post=post) 
            
        else: 
            user.dislike(post=post)

        user.save()
        post.save()
        return HttpResponse(status=204)
    else: 
        return HttpResponse(status=400)
        

    
def get_current_user(request):
    return JsonResponse(request.user.serialize(), status=200)


    











