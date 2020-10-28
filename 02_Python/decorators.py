def announce(function):
    def wrapper():
        print("About to run the function...")
        function()
        print("Done with the function")
    return wrapper


@announce
def hello():
    print("Hello, World!")



hello()
