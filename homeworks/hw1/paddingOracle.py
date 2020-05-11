import requests
import json
import copy
from connector import Connector


def splitBlocks(seq, length):
    return [seq[i: i + length] for i in range(0, len(seq), length)]


def xorByte(block: bytearray, index: int, val: int) -> bytearray:
    byte = bytearray()
    count = 0
    for b in block:
        if count == index:
            b = val
        byte.append(b)
        count += 1
    return byte


def setByte(block: bytearray, index: int, val: int) -> bytearray:
    byte = bytearray()
    count = 0
    for b in block:
        if count == index:
            b = val
        byte.append(b)
        count += 1
    return byte


def stringify(arr):
    return ''.join(map(lambda x: str(x), arr))


con: Connector = Connector('http://localhost:3000',
                           '/getChallenge', '/attemptChallenge')

res: requests.Response = con.getChallenge()
res = json.loads(res.text)

data: str = res['data']
key: str = res['key']

paddingCount = 0
blockSize = 8
blockLength = blockSize * 2
text = []
cp = splitBlocks(data, blockLength)
prevxor = 0x01
xorval = 0x01
bitschanged = 0

# go over all blocks from last to start
# the count block you split into 8 parts
# c is the number of the part

# take 2 blocks, count count-1
# the count-1[c] byte you xor with i in range 1,255
# we send the count-1 block + count block
# until: you recieve none
# the i is the text thats needed.

for count in reversed(range(0, len(cp))):
    xors = []
    for c in reversed(range(0, 8)):
        for i in range(0, 256):
            testcp = copy.deepcopy(cp)
            b = xorByte(bytes.fromhex(testcp[count-1]), c, i)
            expCount = 0
            expXor = 0x01
            for i in reversed(range(len(testcp)-bitschanged, len(testcp))):
                b = setByte(b, c+bitschanged, xorval ^ xors[expCount])
                expCount += 1
                expXor += 1
            testcp[count-1] = b.hex()

            attempt: requests.Response = con.attemptChallenge(
                {'data': stringify(testcp), 'key': key})
            result = json.loads(attempt.text)
            print(result['error'])
            if result['error'] != 'pad' and result['error'] != 'padding':
                xors.append(xorval ^ i)
                text.append(xorval ^ i ^ bytes.fromhex(testcp[count])[c])
                xorval += 1
                bitschanged += 1
                break
    print(text)
    break
