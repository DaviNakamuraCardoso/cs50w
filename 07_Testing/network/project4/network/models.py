from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first = models.CharField(max_length=64)
    last = models.CharField(max_length=64)
    




class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    likes  = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)



