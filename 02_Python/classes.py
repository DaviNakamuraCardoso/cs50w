class Point():
    def __init__(self, x, y):
        self.x = x
        self.y = y



p = Point(2, 3)
print(p.x)
print(p.y)



class Flight():
    def __init__(self, capacity):
        self.capacity = capacity
        self.passengers = []

    def add_passenger(self, name):
        if not self.open_seats():
            return False
        else:
            self.passengers.append(name)
            return True

    def open_seats(self):
        return (self.capacity - len(self.passengers))


flight = Flight(3)
people = ["Brian", "David", "Doug", "Colton"]
for person in people:
    if flight.add_passenger(person):
        print(f"{person} was succesfully added to the flight")
    else:
        print(f"Could not add {person} to the flight")
    
