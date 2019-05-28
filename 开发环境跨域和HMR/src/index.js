const xhr = new XMLHttpRequest()

xhr.open('GET', '/api/user', true)

// xhr.open('GET', '/api1/name', true)

xhr.onreadystatechange = function() {
    if(xhr.status === 200) {
        console.log(xhr.response);
    }
}

xhr.send()
