import fetch from 'node-fetch';

const getChallenge = async () => {
    let res = await fetch("http://localhost:3000/getChallenge");
    let body = await res.json();

    let BLOCK_SIZE = 8 //Init BLOCK_SIZE
    let buf = Buffer.from(body.data, 'hex') // Initial buf with body.data which holds of course the data

    
}

getChallenge()