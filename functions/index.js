const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({origin: true});
const express = require('express');
const engines = require('consolidate');
const ui = express();
const api = express();

var bodyParser = require("body-parser");

// --- UI Rendering ----
ui.engine('hbs', engines.handlebars);
ui.set('views', './public');
ui.set('view engine', 'hbs');
ui.use(express.static(__dirname + '/public'));


ui.get('/', (request, response) => {
     response.render('home');
    });

ui.get('/login', (request, response) => {
    response.render('login');
});

ui.get('/profile', (request, response) => {
    response.render('profile');
});

ui.get('/questions', (request, response) => {
    response.render('questions');
});

ui.get('/question', (request, response) => {
    response.render('question');
});

ui.get('/admin', (request, response) => {
    response.render('admin');
});

exports.ui = functions.https.onRequest(ui);

// --- API ----
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

function findAll(request, response, path){
    var objectList = [];
    return admin.database().ref(path).once("value", function(data) {
        data.forEach(function(childData) {
            const responseBody = {
                "key": childData.key,
                "data": childData.val()
            };
            objectList.push(responseBody)
        });
        return response.json(objectList);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function findToALimit(request, response, path, limit){
    var objectList = [];
    return admin.database().ref(path).limitToFirst(limit).once("value", function(data) {
        data.forEach(function(childData) {
            const responseBody = {
                "key": childData.key,
                "data": childData.val()
            };
            objectList.push(responseBody)
        });
        return response.json(objectList);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function findById(request, response, path) {
    return admin.database().ref(path).once("value", function(data) {
        console.log("Returning country with given ID" + data);
        const responseBody = {
            "key": data.key,
            "data": data.val()
        };
        return response.json(responseBody);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function save(request, response, path, body) {
    console.log("posting with data ---" +request);
    return admin.database().ref(path).push(body).then((snapshot) => {
        console.log("Successfully posted country with ref ---" +snapshot.ref);
        const responseBody = {
            "key": snapshot.key,
            "ref": snapshot.ref
        };
        return response.json(responseBody);
    });

    // return admin.database().ref('/country').push({country_name: countryName}).then((snapshot) => {
    //     console.log("Successfully posted country with ref ---" +snapshot.ref);
    //     const responseBody = {
    //         "key": snapshot.key,
    //         "ref": snapshot.ref
    //     };
    //     return response.json(responseBody);
    // });
}

function update(request, response, path, body) {
    console.log("updating with data ---" +request.body);
    return admin.database().ref(path).update(body).then((snapshot) => {
        const responseBody = {
            "status" : "success"
        };
        return response.json(responseBody);
    });
}

function deleteAPi(request, response, path) {
    return admin.database().ref(path).remove().then(() => {
        const responseBody = {
            "status": "OK"
        };
        return response.json(responseBody);
    });
}
// --- COUNTRY TABLE ----

//get all countries and return list
api.get('/api/v1/country', (request, response) => {
    findAll(request, response, '/country')
});

//get a certain number of countries
api.get('/api/v1/country/', (request, response) => {
    findToALimit(request, response, '/country', request.params.limit)
});

//get country by ID
api.get('/api/v1/country/:country_id', (request, response) => {
    findById(request, response, '/country/'+request.params.country_id)
});

//create country
api.post('/api/v1/country', (request, response) => {
    save(request, response, '/country',request.body)

});

//update country
api.patch('/api/v1/country/:country_id', (request, response) => {
    update(request, response,'/country/'+request.params.country_id, request.body)

});

//delete country
api.delete('/api/v1/country/:country_id', (request, response) => {
    deleteAPi(request, response,'/country/'+request.params.country_id)
});

exports.api = functions.https.onRequest(api);
