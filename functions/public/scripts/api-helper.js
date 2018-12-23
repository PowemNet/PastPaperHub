function httpGet (url) {
    const fullUrl = BASE_URL + url
    console.log ("GETing data with url: " + fullUrl)
    return fetch(fullUrl, {})
        .then(response => response.json())
}

function httpPost(url = ``, data = {}) {
    const fullUrl = BASE_URL + url
    console.log ("POSTing data with url: " + fullUrl + " and data: " + data)
    return fetch(fullUrl, {
        method: "POST",//PUT, DELETE
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json());
}

function httpPatch(url = ``, data = {}) {
    const fullUrl = BASE_URL + url
    console.log ("PATCHing data with url: " + fullUrl + " and data: " + data)
    return fetch(fullUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ country: "testCunt" }),
    })
        .then(response => response.json());
}