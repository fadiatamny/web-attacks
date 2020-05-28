import base64
import json
import copy
import requests

from connector import Connector 

con: Connector = Connector('http://localhost:3000',
                           '/getChallenge', '/attemptChallenge')

res: requests.Response = con.getChallenge()
res = json.loads(res.text)

data: str = res['data']
key: str = res['key']
print(data)

def stringify(arr):
    return ''.join(map(lambda x: str(x), arr))

def split_blocks(data):
    length = len(data)
    blocks = []
    for i in range(0,int(length/8)):
        blocks.append(data[i*8:(i+1)*8])
    print(blocks)
    return blocks


def find_last_byte(ctext):
    ctext = bytearray(ctext)
    blucks = split_blocks(ctext)

    c_prime = bytearray([b for b in blucks[4]])
    
    for byte in range(0,256):
        print("this is byte:")
        print(byte)
        c_prime[7] = byte  #maybe that ?
        print('this is 5: ' )
        print(blucks[5])
        print('this is c_prime: ' )
        print(c_prime)
        to_test = c_prime + blucks[5]
        print('this is to test: ')
        print(to_test)
        print('this is string:')
        print(str(to_test,'utf-8','ignore'))
        
        attempt: requests.Response = con.attemptChallenge(
            {'data': str(to_test,'utf-8','ignore'), 'key': key})
        result = json.loads(attempt.text)
        # print(result['error'])
        if result['error'] != 'pad' and result['error'] != 'padding':
            print ("%d" % (byte ^ 0x01 ^ blucks[4][7]))
            break

if __name__== "__main__": #you dont need this guys just write findlastbye n data dont do main :P 
    find_last_byte(bytes(data,'utf-8'))
    # bytestest = bytes(data,'ascii')
    # print(bytestest)
    # stringtest = str(bytestest,'ascii')
    # print(stringtest)
