CC = gcc
CFLAGS  = -fno-stack-protector

default: Client_buff.out Client_timing.out Server.out

Client_buff.out: Client_buff.c
	$(CC) $^ -o $@

Client_timing.out: Client_timing.c
	$(CC) $^ -o $@

Server.out: Server.c
	$(CC) $^ -o $@