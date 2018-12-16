function httpGet (url) {
    return fetch(BASE_URL + url)
        .then(response => response.json())
}

function httpPost(url = ``, data = {}) {
    return fetch(url, {
        method: "POST",//PUT, DELETE
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json());
}