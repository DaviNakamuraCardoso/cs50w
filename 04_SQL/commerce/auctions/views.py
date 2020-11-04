from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import User, Listing, Bid, Comment


def index(request):
    return render(request, "auctions/index.html", {
    "listings":Listing.objects.all(),
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
        "bids": user.user_bids.all()
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
    return render(request, "auctions/new.html")


def listing_view(request, id):
    listing = Listing.objects.get(id=id)
    user_bid = request.user.user_bids.filter(listing=listing)
    if len(user_bid) < 1:
        user_bid = None
    if request.method == 'POST':
        return HttpResponseRedirect(reverse('add_bid', args=(id, )))
    return render(request, "auctions/listing.html", {
        "listing":listing,
        "listing_bids":listing.listing_bids.all().order_by('-bid'),
        "user_bid": user_bid
    })



@login_required
def add_bid(request, id):
    listing = Listing.objects.get(id=id)
    new_bid = int(request.POST['bid'])
    if new_bid >= listing.current_bid and new_bid > listing.starting_bid:
        listing.winner = request.user.username
        listing.current_bid = new_bid
        listing.save()

        bid = Bid(user=request.user, bid=new_bid, listing=listing)
        bid.save()
        return HttpResponseRedirect(reverse("listing", args=(id, )))
