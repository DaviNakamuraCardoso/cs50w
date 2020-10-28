def main():
    heroes = {"Batman": "Bruce Wayne", "Superman": "Clark Kent"}
    print(heroes["Batman"])
    heroes["Batgirl"] = "Barbara Gordon"
    for hero in heroes.keys():
        print(heroes[hero])


if __name__ == '__main__':
    main()
