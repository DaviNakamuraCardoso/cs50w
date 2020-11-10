from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first = models.CharField(max_length=64, default="")
    last = models.CharField(max_length=64, default="")


    def __str__(self):
        return f"{self.first} {self.last} ({self.username})"


    def like(self, post):
        like = Like(user=self, post=post, is_dislike=False)
        like.save()
        

    
    def dislike(self, post):
        dislike = Like(user=self, post=post, is_dislike=True)
        dislike.save()



    def serialize(self):
        return {
            "likes":[like.post.id for like in self.user_likes.all().filter(is_dislike=False)], 
            "dislikes": [dislike.post.id for dislike in self.user_likes.all().filter(is_dislike=True)],
            "posts":[post.id for post in self.posts.all()],
            "first":self.first, 
            "last":self.last, 
            "username":self.username, 
            "email":self.email, 
            "id": self.id

        }


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
            "post": self.post, 
            "timestamp": self.timestamp.strftime("%b %d, %Y %-I:%M %p"), 
            "likes": len(self.post_likes.all().filter(is_dislike=False)), 
            "dislikes": len(self.post_likes.all().filter(is_dislike=True))
        }


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    is_dislike = models.BooleanField(default=False)


    def __str__(self):
        return f"Like on {self.post} by {self.user}"






