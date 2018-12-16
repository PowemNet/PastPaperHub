
function httpGet(url = ``) {
    return fetch(url)
        .then(response => response.json());
}