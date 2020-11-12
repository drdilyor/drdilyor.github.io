import socket
from sys import argv


try:
    host = argv[1]
    port = int(argv[2])
except (IndexError, ValueError):
    print("usage: python3 socket.py <host> <port>")
    exit(1)

print("trying...")

mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysock.connect((host, port))

print(f"connected to {host}")
print("press ctrl+C to cancel")

while True:
    line = input()
    mysock.send(f'{line}\r\n'.encode())
    if not line:
        break


# read data
while True:
    data = mysock.recv(512)
    if not data:
        break
    print(data.decode(), end='')  # decode UTF-8

mysock.close()
print("connection closed")
