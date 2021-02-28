#include <stdio.h>

int main(void)
{
    int i, steps;
    i = 63728127; 
    // scanf("%i", &i);

    for (steps = 0; i != 1; steps++)
    {
        int d = i % 2;
        i = d * (2*i + 1) + i / (2 - d);
        printf("i is now %i\n", i);

    }
    printf("%i\n", steps);

}
