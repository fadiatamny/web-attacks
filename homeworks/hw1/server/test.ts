import fetch from 'node-fetch';

const getChallenge = async () => {
    let res = await fetch("http://localhost:3000/getChallenge");
    let body = await res.json();
    console.log(body);

    let res2 = await fetch("http://localhost:3000/attemptChallenge", 
        { method: 'POST',
        body: JSON.stringify(body),
        headers: { "Content-Type" : "application/json" } });
    console.log(await res2.json());
}

getChallenge()