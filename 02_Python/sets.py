def main():
    #Creating a empty set
    s = set()
    s.add(1)
    s.add(2)
    s.add(3)
    s.add(4)
    print(s)
    s.add(3)
    print(s)
    s.remove(2)
    print(s)

    print(f"The set has {len(s)} elements.")


if __name__ == "__main__":
    main()
