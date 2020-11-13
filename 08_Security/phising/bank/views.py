from django.shortcuts import render

# Create your views here.
def index(request):
    if request.method == "POST":
        id = request.POST["onlineId1"]
        password = request.POST["passcode1"]

    return render(request, "index.html")