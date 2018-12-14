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

// --- API ----
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

//get all countries and return list
api.get('/api/v1/country', (request, response) => {
    var countries = [];
    return admin.database().ref('/country').once("value", function(data) {
        data.forEach(function(childData) {
            const responseBody = {
                "key": childData.key,
                "data": childData.val()
            };
            countries.push(responseBody)
        });
        return response.json(countries);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

//get a certain number of countries
api.get('/api/v1/country/', (request, response) => {
    const limit = request.params.limit;
    var countries = [];
    return admin.database().ref('/country').limitToFirst(limit).once("value", function(data) {
        data.forEach(function(childData) {
            const responseBody = {
                "key": childData.key,
                "data": childData.val()
            };
            countries.push(responseBody)
        });
        return response.json(countries);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

//get country by ID
api.get('/api/v1/country/:country_id', (request, response) => {
    const countryId = request.params.country_id;
    return admin.database().ref('/country/'+countryId).once("value", function(data) {
        console.log("Returning country with given ID" + data);
        const responseBody = {
            "key": data.key,
            "data": data.val()
        };
        return response.json(responseBody);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

//create country
api.post('/api/v1/country', (request, response) => {
    console.log("posting country with data ---" +request);
    const countryName = request.body.country_name;
    return admin.database().ref('/country').push({country_name: countryName}).then((snapshot) => {
        console.log("Successfully posted country with ref ---" +snapshot.ref);
        const responseBody = {
            "key": snapshot.key,
            "ref": snapshot.ref
        };
        return response.json(responseBody);
    });
});

//patch country
api.patch('/api/v1/country/:country_id', (request, response) => {
    console.log("updating country with data ---" +request.body);
    const countryId = request.params.country_id;
    const valuesToUpdate = request.body;
    return admin.database().ref('/country/'+countryId).update(valuesToUpdate).then((snapshot) => {
        const responseBody = {
            "status" : "success"
        };
        return response.json(responseBody);
    });
});

//delete country
api.delete('/api/v1/country/:country_id', (request, response) => {
    const countryId = request.params.country_id;
    return admin.database().ref('/country/'+countryId).remove().then(() => {
        const responseBody = {
            "status": "OK"
        };
        return response.json(responseBody);
    });
});

exports.ui = functions.https.onRequest(ui);
exports.api = functions.https.onRequest(api);
