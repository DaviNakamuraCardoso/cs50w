def main():
    n = int(input("Number: "))
    positive(n)

    return


def positive(number):
    if number > 0:
        print(f"{number} is positive.")
    elif number < 0:
        print(f"{number} is negative.")
    else:
        print("This number is 0.")
    return


if __name__ == "__main__":
    main()
