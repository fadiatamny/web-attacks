const btn = document.getElementById('submit')

const loadPosts = (posts) => {
    const comments = document.getElementById('comments')
    comments.innerHTML = ''

    for (const c of posts) {
        const li = document.createElement('li')
        li.innerHTML = c.message
        comments.innerHTML += li.outerHTML
    }
}

const fetchPosts = () => {
    btn.disabled = true
    const http = new XMLHttpRequest()
    const url = '/api/posts'
    http.open('GET', url)
    http.setRequestHeader('Access-Control-Allow-Origin', '*')
    http.setRequestHeader('X-XSS-Protection', '0')
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                loadPosts(JSON.parse(http.response))
            }
            btn.disabled = false
        }
    }
    http.send()
}

const newPost = (message) => {
    btn.disabled = true
    const http = new XMLHttpRequest()
    const url = '/api/posts'
    const body = { message }
    http.open('POST', url, true)
    http.setRequestHeader('Access-Control-Allow-Origin', '*')
    http.setRequestHeader('X-XSS-Protection', '0')
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                fetchPosts()
            }
            btn.disabled = false
        }
    }
    http.send(JSON.stringify(body))
}

const handleFormSubmit = () => {
    const input = document.getElementById('comment')
    const comment = input.value
    if (comment != '') {
        input.value = ''
        newPost(comment)
    }
    return false
}

fetchPosts()
btn.onclick = handleFormSubmit
