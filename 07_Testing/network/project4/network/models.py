from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first = models.CharField(max_length=64, default="")
    last = models.CharField(max_length=64, default="")

    def __str__(self):
        return f"{self.first} {self.last} ({self.username})"







class Post(models.Model):
    post = models.CharField(max_length=5000)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Post {self.id} by {self.user.username}"


    def serialize(self):
        return {
            "id": self.id, 
            "user": self.user.username, 
            "post": self.post 
        }




class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    is_dislike = models.BooleanField(default=False)


    def __str__(self):
        return f"Like on {self.post} by {self.user}"






