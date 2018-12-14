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

//get country by ID

api.get('/api/v1/country/:country_id', (request, response) => {
    const countryId = request.params.country_id;
    return admin.database().ref('/country/'+countryId).once("value", function(data) {
        console.log("Returning country with given ID" + data);
        return response.json(data);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

//get all countries and return list

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

//update country
//delete country

exports.ui = functions.https.onRequest(ui);
exports.api = functions.https.onRequest(api);
