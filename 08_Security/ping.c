#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define THREADS 20


static void* ping(void* v)
{
    for (int i = 0; i < 5000; i++)
    {
        system("ping p4ed.com");
    }
}

int main(void)
{
    pthread_t p[THREADS];

    for (int i = 0; i < THREADS; i++)
    {
        pthread_create(&p[i], NULL, ping, NULL);
    }

}
