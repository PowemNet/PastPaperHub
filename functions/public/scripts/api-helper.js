function httpGet (url) {
    console.log ("GETing data with url: " + url)
    return fetch(BASE_URL + url, {})
        .then(response => response.json())
}

function httpPost(url = ``, data = {}) {
    console.log ("POSTing data with url: " + url + " and data: " + data)
    return fetch(url, {
        method: "POST",//PUT, DELETE
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json());
}

function httpPatch(url = ``, data = {}) {
    console.log ("PATCHing data with url: " + url + " and data: " + data)
    return fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json());
}