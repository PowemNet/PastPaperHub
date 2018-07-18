const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './public');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
     response.render('home');
    });

app.get('/login', (request, response) => {
    response.render('login');
});

app.get('/profile', (request, response) => {
    response.render('profile');
});

exports.app = functions.https.onRequest(app);
