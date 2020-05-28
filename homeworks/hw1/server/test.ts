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
        let index: Array<number> = [] // This array holds the current block decrypted bytes
        for (let i = 0; i < 256; ++i) {
            let toDecrypt: Buffer = Buffer.alloc(BLOCK_SIZE, 0) // Allocation BLOCK_SIZE (each iteration grows by 8)
            buffer.copy(toDecrypt) // copy BLOCK_SIZE bytes to toDecrypt

            switch (byte) {
                case 7:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ i
                    break
                case 6:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 1)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (i ^ 1)
                    break
                case 5:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 2)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 2)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (i ^ 2)
                    break
                case 4:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 3)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 3)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 3)
                    toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (i ^ 3)
                    break
                case 3:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 4)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 4)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 4)
                    toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 4)
                    toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (i ^ 4)
                    break
                case 2:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 5)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 5)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 5)
                    toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 5)
                    toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 5)
                    toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (i ^ 5)
                    break
                case 1:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 6)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 6)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 6)
                    toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 6)
                    toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 6)
                    toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (index[5] ^ 6)
                    toDecrypt[BLOCK_SIZE - 7] = toDecrypt[BLOCK_SIZE - 7] ^ (i ^ 6)
                    break
                case 0:
                    toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 7)
                    toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 7)
                    toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 7)
                    toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 7)
                    toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 7)
                    toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (index[5] ^ 7)
                    toDecrypt[BLOCK_SIZE - 7] = toDecrypt[BLOCK_SIZE - 7] ^ (index[6] ^ 7)
                    toDecrypt[BLOCK_SIZE - 8] = toDecrypt[BLOCK_SIZE - 8] ^ (i ^ 7)
                    break
                default:
                    break
            }
            let attempt: any = await fetch("http://localhost:3000/attemptChallenge", { body: JSON.stringify({ data: toDecrypt.toString('hex'), key: body.key }), method: "POST", headers: { "Content-Type": "application/json" } })
            let result: any = await attempt.json()
            if (result.error == 'tag') {
                if ((i.toString(16) < '20' || i.toString(16) > '7A')) {
                    done = true
                }

                index.push(i)
                cipherHex += i.toString(16)
                i = 0
                byte--;
            }
        }

        //strFixed appends the reversed string(which is the correct one)
        text += reverse(decrypt(cipherHex))
        BLOCK_SIZE += 8
        console.log(text);
    }
    console.log(`\nDecrypted data\n>${text}`)
}

getChallenge()