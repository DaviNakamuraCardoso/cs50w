people = [
    {"hero":"Batman", "name":"Bruce Wayne"},
    {"hero":"Superman", "name":"Clark Kent"},
    {"hero":"Catwoman", "name":"Selina Kyle"}
]


people.sort(key= lambda person:person["name"])


print(people)
