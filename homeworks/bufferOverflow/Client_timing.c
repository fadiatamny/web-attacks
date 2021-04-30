/**
 *  FADI ATAMNY 206793275
 *  OR EITAN 305783938
 */


#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <time.h>
#define MAX 256
#define PORT 8080
#define SA struct sockaddr

int main(int argc, char *argv[])
{
    int recv_size;
    int sockfd, connfd;
    struct sockaddr_in servaddr, cli;
    char buff[MAX] = {0};
    char pass[8] = "00000000";
    int time_pass = 0;
    time_t startTime,endTime;
    int lastTime = 0;
    int k = 0;

    do
    {
        // socket create and varification
        sockfd = socket(AF_INET, SOCK_STREAM, 0);
        if (sockfd == -1)
        {
            printf("socket creation failed...\n");
            exit(0);
        }
        else
            printf("Socket successfully created..\n");
        bzero(&servaddr, sizeof(servaddr));

        // assign IP, PORT
        servaddr.sin_family = AF_INET;
        servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
        servaddr.sin_port = htons(PORT);

        // connect the client socket to server socket
        if (connect(sockfd, (SA *)&servaddr, sizeof(servaddr)) != 0)
        {
            printf("connection with the server failed...\n");
            exit(0);
        }
        else
            printf("connected to the server..\n");

        char tmp[256] = {0};
        recv_size = recv(sockfd, tmp, 256, 0);

        if (recv_size <= 0)
        {
            printf("Connection close!\n");
            close(sockfd);
            exit(0);
        }

        printf("Server: %s\n", tmp);
        memset(buff, 0, 256);
        strcpy(buff, pass);
        printf("sending... %s\n", buff);

        startTime = time(NULL);
        
        write(sockfd, buff, sizeof(buff));

        memset(tmp, 0, 256);
        recv_size = recv(sockfd, tmp, 256, 0);
        if (recv_size <= 0)
        {
            printf("Connection close!\n");
            close(sockfd);
            exit(0);
        }
        printf("Server: %s\n", tmp);
        endTime = time(NULL);

        time_pass = endTime-startTime;
        printf("Time took: %d\n", time_pass);

        if (lastTime < time_pass)
        {
            k++;
            lastTime = time_pass;
        }

        pass[k]++;
        close(sockfd);
    } while (k < 8);
}