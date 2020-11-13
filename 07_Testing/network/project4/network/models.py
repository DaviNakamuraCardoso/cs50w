from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first = models.CharField(max_length=64, default="")
    last = models.CharField(max_length=64, default="")

    def __str__(self):
        return f"{self.first} {self.last} ({self.username})"


    def follow(self, user):
        f = Follow(follower=self, followed=user, followerId=self.id, followedId=user.id)
        f.save()
        self.save()
        user.save()



    def unfollow(self, user):
        f = self.following.get(followedId=user.id)
        f.delete()
        self.save()
        user.save()
        


    def like(self, post):
        try: 
            dislike = Dislike.objects.get(dislike_post_id=post.id, dislike_user_id=self.id) 
            dislike.delete()
            self.save()
            post.save()
        except Dislike.DoesNotExist:
            pass
            

        like = Like(user=self, post=post, like_user_id=self.id, like_post_id=post.id)
        like.save()
        
    
    def dislike(self, post):
        try:
            like = Like.objects.get(like_post_id = post.id, like_user_id = self.id)
            like.delete()
            self.save()
            post.save()
        except Like.DoesNotExist:
            pass 
        dislike = Dislike(user=self, post=post, dislike_post_id=post.id, dislike_user_id=self.id)
        dislike.save()

    
    def unlike(self, post):
        like = Like.objects.get(like_post_id=post.id, like_user_id=self.id)
        like.delete()
        self.save()
        post.save()

    def undo_dislike(self, post):
        dislike = Dislike.objects.get(dislike_post_id=post.id, dislike_user_id=self.id)
        dislike.delete()
        self.save()
        post.save()




    def serialize(self):
        return {
            "posts":[post.id for post in self.posts.all()],
            "first":self.first, 
            "last":self.last, 
            "liked_posts": [like.post.id for like in self.user_likes.all()], 
            "disliked_posts": [dislike.post.id for dislike in self.user_dislikes.all()], 
            "followers": [follow.follower.username for follow in self.followers.all()], 
            "following": [follow.followed.username for follow in self.following.all()], 
            "username":self.username, 
            "email":self.email, 
            "id": self.id,
            "message": "Logged."

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
            "likes": len(self.post_likes.all()), 
            "dislikes": len(self.post_dislikes.all())
        }


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    like_post_id = models.IntegerField(default=2)
    like_user_id = models.IntegerField(default=2)




    def __str__(self):
        return f"Like on {self.post} by {self.user}"


class Dislike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_dislikes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_dislikes")
    dislike_post_id = models.IntegerField(default=1)
    dislike_user_id = models.IntegerField(default=1)

    def __str__(self):
        return f"Dislike on {self.post} by {self.user}"


class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followerId = models.IntegerField()

    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    followedId = models.IntegerField()

    def __str__(self):
        return f"Follow {self.id}: {self.follower.username} follows {self.followed.username}"
     


