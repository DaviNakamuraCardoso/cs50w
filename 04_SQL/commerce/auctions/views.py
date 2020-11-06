from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import User, Listing, Bid, Comment



CATEGORIES = [
    "Toys",
    "Fashion",
    "Programming",
    "Cars",
    "Eletronics",
    "Home",
    "Games",
    "Music",
    "Books"
]


def index(request):

    if request.method == 'POST':
        category = request.POST['selected']
        return HttpResponseRedirect(reverse('category', args=(category, )))
    return render(request, "auctions/index.html", {
    "listings":Listing.objects.all().order_by('-id'),
    "categories": CATEGORIES
    })


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = request.POST["first_name"]
            user.last_name = request.POST["last_name"]
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def user_page(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/user_page.html", {
        "page_user":user,
        "user_listings": user.listings.all(),
        "bids": user.user_bids.all(),
        "watchlist": user.watchlist.all()

    })


def search_category(request, category):
    return render(request, "auctions/category.html", {
        "results": Listing.objects.filter(category=category).order_by('-id'),
        "category": category
    })



@login_required
def new_listing(request):
    if request.method == 'POST':

        title = request.POST['title']
        start_bid = request.POST['start_bid']
        description = request.POST['description']
        category = request.POST['category']
        image_url = request.POST['image_url']


        listing = Listing(
            user=request.user,
            title=title,
            starting_bid=start_bid,
            description=description,
            category=category,
            image_url = image_url


        )
        listing.save()
        return HttpResponseRedirect(reverse('listing', args=(listing.id, )))
    return render(request, "auctions/new.html", {
        "categories": CATEGORIES
    })

@login_required
def listing_view(request, id):
    message = None
    listing = Listing.objects.get(id=id)
    user_bid = request.user.user_bids.filter(listing=listing)
    relations = {
        "close_listing": request.user.close_listing,
        "add_watchlist": request.user.add_listing,
        "remove_watchlist": request.user.remove_listing,
        "add_bid": listing.add_bid,
        "updated_bid": listing.update_bid,
        "new_comment": listing.add_comment


    }
    if len(user_bid) < 1:
        user_bid = None


    if request.method == 'POST':
        for value in relations.keys():
            interact(request=request, listing=listing, value=value, function=relations[value], return_message="Unable to do.", id=id)



    return render(request, "auctions/listing.html", {
        "listing":listing,
        "listing_bids":listing.listing_bids.all().order_by('-bid'),
        "user_bid": user_bid,
        "non_watchers": User.objects.exclude(watchlist=listing).all(),
        "comments": listing.listing_comments.all().order_by('-id'),
        "message": message
    })


@login_required
def interact(request, listing, value, function, return_message, id):
    if value in request.POST:
        try:
            function(request.POST[value], user=request.user)


        except:
            function(id)

        return HttpResponseRedirect(reverse('listing', args=(listing.id, )))
    else:
        pass





@login_required
def watchlist(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/watchlist.html", {
        "user": user,
        "watchlist": user.watchlist.all().order_by('-id')

    })



@login_required
def bids(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/bids.html", {
    "user": user,
    "bids": user.user_bids.all()
    })
























































































#
