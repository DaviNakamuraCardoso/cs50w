#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <curl/curl.h>


#define TARGET "https://en.wikipedia.org/wiki/C_(programming_language)"


static void ping(void)
{
    for (int i = 0; i < 5000; i++)
    {
        CURL* curl = curl_easy_init();
        if (curl)
        {
            CURLcode res;
            curl_easy_setopt(curl, CURLOPT_URL, TARGET); 

            res = curl_easy_perform(curl); 
            curl_easy_cleanup(curl);
            sleep(1);
        }

    }
}

int main(void)
{

    while (1) ping();
    return 0;

}
