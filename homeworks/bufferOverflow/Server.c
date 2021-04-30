/**
 *  FADI ATAMNY 206793275
 *  OR EITAN 305783938
 */

#include <stdio.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#define PORT 8080

char pass[8] = "12345678";

void handleConnection(int sock)
{
    struct sockaddr_in client;
    socklen_t len;
    char *message;
    int fd, recv_size;
    char buffer[8];
    int validation = 0;

    len = sizeof(client);
    fd = accept(sock, (struct sockaddr *)&client, &len);
    if (fd < 0)
    {
        printf("Error acepting\n");
        exit(-1);
    }

    printf("Got connection!\n");
    message = "Welcome! Please enter the password (8 characters):";
    send(fd, message, strlen(message), 0);
    char tmp[256] = {0};
    recv_size = recv(fd, tmp, 256, 0);
    strcpy(buffer, tmp);

    if (recv_size <= 0)
    {
        printf("Connection close!\n");
        close(fd);
        return;
    }

    int i = 0;
    for(i = 0; i < 8; i++) 
    {
        if (buffer[i] != pass[i]) 
            break;
        sleep(1);
    }

    if (i == 8) {
        validation = 1;
    } else {
        printf("incorrect password recieved!\n");
        message = "incorrect password recieved !";
        send(fd, message, strlen(message), 0);
    }

    if (validation) {
        printf("root access granted!\n");
        message = "root access granted!";
        send(fd, message, strlen(message), 0);
    }


    printf("Connection close!\n\n\n");
    close(fd);
}

int main()
{
    struct sockaddr_in server;
    int sock;

    sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (sock < 0)
    {
        printf("Error opening socket\n");
        exit(-1);
    }

    server.sin_port = htons(PORT);
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_family = AF_INET;

    if (bind(sock, (struct sockaddr *)&server, sizeof(server)) < 0)
    {
        printf("Error binding socket\n");
        exit(-1);
    }

    if (listen(sock, 5) == -1)
    {
        printf("Error listening\n");
        exit(-1);
    }

    printf("Waiting for connections...\n");
    while(1) 
    {
        handleConnection(sock);
    }
}