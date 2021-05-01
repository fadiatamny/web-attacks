const loadPosts = (posts) => {
    const cookies = document.getElementById('comments')
    cookies.innerHTML = ''
    
    for (const c of posts) {
        const li = document.createElement('li')
        li.innerHTML = `${c.site}\t||\t${c.cookie}`
        cookies.innerHTML += li.outerHTML
    }
}

const fetchPosts = () => {
    const http = new XMLHttpRequest()
    const url = '/api/cookies'
    http.open('GET', url)

    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                loadPosts(JSON.parse(http.response))
            }
        }
    }
    http.send()
}

fetchPosts()