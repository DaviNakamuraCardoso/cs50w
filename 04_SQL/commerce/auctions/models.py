from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    first_name = models.CharField(max_length=64, default="")
    last_name = models.CharField(max_length=64, default="")

    def add_listing(self, listing_id):
        listing = Listing.objects.get(id=listing_id)
        listing.watchers.add(self)
        listing.save()
        return True

    def remove_listing(self, listing_id):
        listing = Listing.objects.get(id=listing_id)
        listing.watchers.remove(self)
        listing.save()
        return True

    def close_listing(self, listing_id):
        listing = Listing.objects.get(id=listing_id)
        if listing in self.listings.all():
            listing.is_closed = True
            listing.save()
            return True
        else:
            return False

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
    category = models.CharField(max_length=64, default="Miscellaneous")
    image_url = models.CharField(max_length=3000, null=True, blank=True)


    current_bid = models.IntegerField(default=0)
    winner = models.CharField(max_length=64, default="No winners yet.")
    is_closed = models.BooleanField(default=False)
    watchers = models.ManyToManyField(User, blank=True, related_name="watchlist")


    def check_bid(self, value, user):
        value = int(value)
        if value > self.current_bid and value >= self.starting_bid:
            self.winner = user.username
            self.current_bid = value
            self.save()
            return True


    def add_bid(self, value, user):

        if self.check_bid(value=value, user=user):
            bid = Bid(bid=value, user=user, listing=self)
            bid.save()
            return True
        else:
            return False

    def update_bid(self, value, user):
        if self.check_bid(value=value, user=user):
            bid = user.user_bids.filter(listing=self)[0]
            bid.bid = value
            bid.save()
            return True
        else:
            return False

    def add_comment(self, comment, user):
        comment = Comment(user=user, listing=self, comment=comment)
        comment.save()
        return True


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
