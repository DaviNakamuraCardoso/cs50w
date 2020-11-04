from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    first_name = models.CharField(max_length=64, default="")
    last_name = models.CharField(max_length=64, default="")

    def add_listing(self, listing):
        listing.watchers.add(self)


    def __str__(self):
        return f"User: {self.username}, ID: {self.id}"


class Listing(models.Model):
    # The owner
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    # Title, description and start bid
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=1200)
    starting_bid = models.IntegerField()

    # Optional arguments
    category = models.CharField(max_length=64, null=True, blank=True)
    image_url = models.CharField(max_length=3000, null=True, blank=True)


    current_bid = models.IntegerField(default=0)
    winner = models.CharField(max_length=64, default="No winners yet.")
    watchers = models.ManyToManyField(User, blank=True, null=True, related_name="watchlist")


    def __str__(self):
        return f"Listing '{self.title}' by {self.user.username}"


class Bid(models.Model):
    bid = models.IntegerField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listing_bids")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_bids")


    def __str__(self):
        return f"Bid on {self.listing.title} by {self.user.username}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="listing_comments")
    comment = models.CharField(max_length=1200)


    def __str__(self):
        return f"Comment on {self.listing.title} by {self.user.username}"
