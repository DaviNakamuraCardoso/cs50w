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
    "Books", 
    "Miscellaneous"
]



def index(request):

    if request.method == 'POST':
        category = request.POST['selected']
        return HttpResponseRedirect(reverse('category', args=(category, )))
    return render(request, "auctions/index.html", {
    "listings":Listing.objects.all().filter(is_closed=False).order_by('-id'),
    "categories": CATEGORIES
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
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
    if username == "admin":
        return HttpResponseRedirect(reverse("admin"))

    return render(request, "auctions/user_page.html", {
        "page_user":user,
        "listings": user.listings.all().order_by("-id"),
        "bids": user.user_bids.all().order_by("-id"),
        "watchlist": user.watchlist.all().order_by("-id")

    })


def search_category(request, category):
    if category not in CATEGORIES: 
        return HttpResponseRedirect(reverse('index'))
    return render(request, "auctions/category.html", {
        "listings": Listing.objects.filter(category=category).order_by('-id'),
        "category": category, 
        "categories": CATEGORIES
    })


def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": CATEGORIES
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

def listing_view(request, id):
    message = "" 
    listing = Listing.objects.get(id=id)
    if request.user.is_authenticated: 

        user_bid = request.user.user_bids.filter(listing__id=listing.id)
        relations = {
        "close_listing": [request.user.close_listing, "Could not close the listing."],
        "add_watchlist": [request.user.add_listing, "Could not add to watchlist."],
        "remove_watchlist": [request.user.remove_listing, "Could not remove from watchlist."],
        "add_bid": [listing.add_bid, "Bids must be greater than or equal the start bid and greater than the current bid."],
        "updated_bid": [listing.update_bid, "Bids must be greater than the current bid."], 
        "new_comment": [listing.add_comment, "Unable to add comment."]
        


    }
        
    else: 
        user_bid = []

    
    if len(user_bid) < 1:
        user_bid = None

    


    if request.method == 'POST':
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))
        
        for value in relations.keys():
            if not interact(request=request, listing=listing, value=value, function=relations[value][0], return_message="Unable to do.", id=id):
                message = relations[value][1]


        if message == "":
            return HttpResponseRedirect(reverse("listing", args=(listing.id, )))

        



    return render(request, "auctions/listing.html", {
        "listing":listing,
        "listing_bids":listing.listing_bids.all().order_by('-bid'),
        "user_bid": user_bid,
        "non_watchers": User.objects.exclude(watchlist=listing).all(),
        "comments": listing.listing_comments.all().order_by('-id'),
        "listings": Listing.objects.exclude(pk=listing.id).filter(category=listing.category, is_closed=False).order_by("-id"),
        "message": message
    })


@login_required
def interact(request, listing, value, function, return_message, id):
    if value in request.POST:
        try:
            return function(request.POST[value], user=request.user)


        except:
            return function(id)

    else:
        return True


@login_required
def watchlist(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/watchlist.html", {
        "user": user,
        "listings": user.watchlist.all().order_by('-id'), 

    })


@login_required
def bids(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/bids.html", {
    "user": user,
    "bids": user.user_bids.all(), 
    "listings": [bid.listing for bid in user.user_bids.all().order_by("-id")]
    })



