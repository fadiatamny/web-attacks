import fetch from 'node-fetch';

const reverse = (str: string): string => {
    let reversed = '';
    for (let j = str.length - 1; j >= 0; j--) {
        if (str[j] != '.')
            reversed += str[j];
    }

    return reversed
}

const decrypt = (str: string): string => {
    let decrypted = '';
    for (let n = 0; n < str.length; n += 2) {
        decrypted += String.fromCharCode(parseInt(str.substr(n, 2), 16));
    }
    return decrypted;
}

const getChallenge = async (): Promise<void> => {
    let res: any = await fetch("http://localhost:3000/getChallenge");
    let body: any = await res.json();

    let text: string = ''
    let buffer: Buffer = Buffer.from(body.data, 'hex')

    let done: boolean = false
    let BLOCK_SIZE: number = 8

    while (!done) {
        let cipherHex: string = ''
        let byte: number = 7;
        let xors: Array<number> = []
        for (let i = 0; i < 256; ++i) {
            let cipherblock: Buffer = Buffer.alloc(BLOCK_SIZE, 0)
            buffer.copy(cipherblock)

            switch (byte) {
                case 7:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ i
                    break
                case 6:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 1)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (i ^ 1)
                    break
                case 5:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 2)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 2)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (i ^ 2)
                    break
                case 4:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 3)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 3)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (xors[2] ^ 3)
                    cipherblock[BLOCK_SIZE - 4] = cipherblock[BLOCK_SIZE - 4] ^ (i ^ 3)
                    break
                case 3:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 4)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 4)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (xors[2] ^ 4)
                    cipherblock[BLOCK_SIZE - 4] = cipherblock[BLOCK_SIZE - 4] ^ (xors[3] ^ 4)
                    cipherblock[BLOCK_SIZE - 5] = cipherblock[BLOCK_SIZE - 5] ^ (i ^ 4)
                    break
                case 2:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 5)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 5)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (xors[2] ^ 5)
                    cipherblock[BLOCK_SIZE - 4] = cipherblock[BLOCK_SIZE - 4] ^ (xors[3] ^ 5)
                    cipherblock[BLOCK_SIZE - 5] = cipherblock[BLOCK_SIZE - 5] ^ (xors[4] ^ 5)
                    cipherblock[BLOCK_SIZE - 6] = cipherblock[BLOCK_SIZE - 6] ^ (i ^ 5)
                    break
                case 1:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 6)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 6)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (xors[2] ^ 6)
                    cipherblock[BLOCK_SIZE - 4] = cipherblock[BLOCK_SIZE - 4] ^ (xors[3] ^ 6)
                    cipherblock[BLOCK_SIZE - 5] = cipherblock[BLOCK_SIZE - 5] ^ (xors[4] ^ 6)
                    cipherblock[BLOCK_SIZE - 6] = cipherblock[BLOCK_SIZE - 6] ^ (xors[5] ^ 6)
                    cipherblock[BLOCK_SIZE - 7] = cipherblock[BLOCK_SIZE - 7] ^ (i ^ 6)
                    break
                case 0:
                    cipherblock[BLOCK_SIZE - 1] = cipherblock[BLOCK_SIZE - 1] ^ (xors[0] ^ 7)
                    cipherblock[BLOCK_SIZE - 2] = cipherblock[BLOCK_SIZE - 2] ^ (xors[1] ^ 7)
                    cipherblock[BLOCK_SIZE - 3] = cipherblock[BLOCK_SIZE - 3] ^ (xors[2] ^ 7)
                    cipherblock[BLOCK_SIZE - 4] = cipherblock[BLOCK_SIZE - 4] ^ (xors[3] ^ 7)
                    cipherblock[BLOCK_SIZE - 5] = cipherblock[BLOCK_SIZE - 5] ^ (xors[4] ^ 7)
                    cipherblock[BLOCK_SIZE - 6] = cipherblock[BLOCK_SIZE - 6] ^ (xors[5] ^ 7)
                    cipherblock[BLOCK_SIZE - 7] = cipherblock[BLOCK_SIZE - 7] ^ (xors[6] ^ 7)
                    cipherblock[BLOCK_SIZE - 8] = cipherblock[BLOCK_SIZE - 8] ^ (i ^ 7)
                    break
                default:
                    break
            }
            let attempt: any = await fetch("http://localhost:3000/attemptChallenge", { body: JSON.stringify({ data: cipherblock.toString('hex'), key: body.key }), method: "POST", headers: { "Content-Type": "application/json" } })
            let result: any = await attempt.json()
            if (result.error == 'tag') {
                if ((i.toString(16) < '20' || i.toString(16) > '7A')) {
                    done = true
                }

                xors.push(i)
                cipherHex += i.toString(16)
                i = 0
                byte--;
            }
        }
        text += reverse(decrypt(cipherHex))
        BLOCK_SIZE += 8
        console.log(text);
    }
    console.log(`\nDecrypted data\n>${text}`)
}

getChallenge()