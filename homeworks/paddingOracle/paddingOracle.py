import requests
import json
import copy
from connector import Connector


def splitBlocks(seq: bytearray, length: int) -> list:
    return [seq[i: i + length] for i in range(0, len(seq), length)]


def decodeMessage(cp: list, blockSize: int) -> str:
    decryptedMessage: list = []
    for count in range(0, len(cp)):
        xors: list = []
        blockText: str = ''

        for c in reversed(range(0, 8)):
            for i in range(0, 256):
                testcp: bytearray = []
                testcp.extend(cp[count])
                if c == 7:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ i
                if c == 6:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 1
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ i ^ 1
                if c == 5:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 2
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 2
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ i ^ 2
                if c == 4:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 3
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 3
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ xors[2] ^ 3
                    testcp[blockSize - 4] = testcp[blockSize - 4] ^ i ^ 3
                if c == 3:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 4
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 4
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ xors[2] ^ 4
                    testcp[blockSize - 4] = testcp[blockSize - 4] ^ xors[3] ^ 4
                    testcp[blockSize - 5] = testcp[blockSize - 5] ^ i ^ 4
                if c == 2:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 5
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 5
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ xors[2] ^ 5
                    testcp[blockSize - 4] = testcp[blockSize - 4] ^ xors[3] ^ 5
                    testcp[blockSize - 5] = testcp[blockSize - 5] ^ xors[4] ^ 5
                    testcp[blockSize - 6] = testcp[blockSize - 6] ^ i ^ 5
                if c == 1:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 6
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 6
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ xors[2] ^ 6
                    testcp[blockSize - 4] = testcp[blockSize - 4] ^ xors[3] ^ 6
                    testcp[blockSize - 5] = testcp[blockSize - 5] ^ xors[4] ^ 6
                    testcp[blockSize - 6] = testcp[blockSize - 6] ^ xors[5] ^ 6
                    testcp[blockSize - 7] = testcp[blockSize - 7] ^ i ^ 6
                if c == 0:
                    testcp[blockSize - 1] = testcp[blockSize - 1] ^ xors[0] ^ 7
                    testcp[blockSize - 2] = testcp[blockSize - 2] ^ xors[1] ^ 7
                    testcp[blockSize - 3] = testcp[blockSize - 3] ^ xors[2] ^ 7
                    testcp[blockSize - 4] = testcp[blockSize - 4] ^ xors[3] ^ 7
                    testcp[blockSize - 5] = testcp[blockSize - 5] ^ xors[4] ^ 7
                    testcp[blockSize - 6] = testcp[blockSize - 6] ^ xors[5] ^ 7
                    testcp[blockSize - 7] = testcp[blockSize - 7] ^ xors[6] ^ 7
                    testcp[blockSize - 8] = testcp[blockSize - 8] ^ i ^ 7

                challenge = ''.join(format(x, '02x') for x in testcp)

                if count != 0:
                    tmpText: str = ''
                    for block in range(0, count):
                        tmpText += ''.join(format(x, '02x') for x in cp[block])
                    challenge = tmpText + challenge

                attempt = con.attemptChallenge(
                    {'data':  challenge, 'key': key})

                result = json.loads(attempt.text)

                if result['error'] == 'tag':
                    xors.append(i)
                    blockText = chr(i) + blockText
                    break

        decryptedMessage.append(blockText)
        print('Decryption progress until now: {0}'.format(''.join(decryptedMessage)))

    return decryptedMessage


con: Connector = Connector('http://localhost:3000',
                           '/getChallenge', '/attemptChallenge')

res: requests.Response = con.getChallenge()
res: str = json.loads(res.text)

data: bytearray = bytearray.fromhex(res['data'])
key: str = res['key']

blockSize: int = 8
cipherBlocks: list = splitBlocks(data, blockSize)

decryptedMessage: list = decodeMessage(cipherBlocks, blockSize)

print('Decrypted Message is: {0}'.format(''.join(decryptedMessage)))
