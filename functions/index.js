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

api.post('/api/v1/country', (request, response) => {
    const countryName = request.body.country_name;
    return admin.database().ref('/country').push({country_name: countryName}).then((snapshot) => {
        return response.redirect(303, snapshot.ref.toString());
    });
});

exports.ui = functions.https.onRequest(ui);
exports.api = functions.https.onRequest(api);


