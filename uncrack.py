import turtle


END_5 = 0
NOT_END_5 = 0


def main():
    pen = turtle.Turtle()
    pen.shape("turtle")
    n = int(input("Write your number here: "))
    for i in range(1, n+1):
        pen.goto((i)-1000, steps(i))

    print(f"{END_5 / i * 100}% of the solutions end in 5.")
    input()


def steps(n):
    global END_5
    counter = 0
    while n != 1:
        n = ((n%2) * (2*n+1) + n) / (2 - (n % 2))

        if n == 5:
            END_5 += 1

        counter += 1

    return counter


if __name__ == '__main__':
    main()
