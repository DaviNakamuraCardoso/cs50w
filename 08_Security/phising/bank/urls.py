from django.urls import path 

from . import views 
urlpatterns = [
    path("bankofamerica.com", views.index, name="index")
]