function httpGet (url) {
    return fetch(BASE_URL + url, {
        // mode: "no-cors", // todo remove this for caching and faster perfomance
        cache: "no-cache", // todo enable cache
        headers: {
            "Access-Control-Allow-Origin": "*", //todo remove this and deal with cors on the  server itself
        },
    })
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