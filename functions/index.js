const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
var cors = require('cors')
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
// var corsOptions = {
//     origin: 'http://localhost:5010',
//     optionsSuccessStatus: 200
// }
// api.use(cors);

/**
 Create a new entry for the item specified. A primary key will be generated by the database
 */
function save(request, response, path, body) {
    console.log("posting with data ---" +request);
    return admin.database().ref(path).push(body).then((snapshot) => {
        console.log("Successfully posted item with ref ---" +snapshot.ref);
        const responseBody = {
            "key": snapshot.key,
            "ref": snapshot.ref
        };
        return response.json(responseBody);
    });

}

function findByColumn(request, response, parentPath, columnName, columnValue){
    var objectList = [];
    return admin.database().ref(parentPath).orderByChild(columnName).equalTo(columnValue).once("value",
        function(data) {
        data.forEach(function(childData) {
            const responseBody = {
                "key": childData.key,
                "data": childData.val()
            };
            objectList.push(responseBody)
        });
        return response.json(objectList);
    }, function (errorObject) {
        console.log("Read failed: " + errorObject.code);
    });
}

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
        console.log("Read failed: " + errorObject.code);
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
        console.log("Read failed: " + errorObject.code);
    });
}

function findById(request, response, path) {
    return admin.database().ref(path).once("value", function(data) {
        console.log("Returning item with given ID" + data);
        const responseBody = {
            "key": data.key,
            "data": data.val()
        };
        return response.json(responseBody);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function checkExists(request, response, path, secondaryPath) {
    return admin.database().ref().child(path).child(secondaryPath).once('value', function (data) {
        const responseBody = {
            "exists": (data.val() !== null),
        };
        return response.json(responseBody);
    }, function (errorObject) {
        console.log("Failed to check if user exists: " + errorObject.code);
    });
}

// /**
//  Create a new entry for the item specified where the primary key is not generated by the database. Primary key should be
//  supplied in the path
//  */
// function set(request, response, path, body) {
//     console.log("posting with data ---" +request);
//     return admin.database().ref(path).push(body).then((snapshot) => {
//         console.log("Successfully posted item with ref ---" +snapshot.ref);
//         const responseBody = {
//             "key": snapshot.key,
//             "ref": snapshot.ref
//         };
//         return response.json(responseBody);
//     });
//
// }

function update(request, response, path, body) {
    console.log("updating with data ---" +request.body);
    return admin.database().ref(path).update(body).then((snapshot) => {
        const responseBody = {
            "status" : "success"
        };
        return response.json(responseBody);
    });
}

function deleteById(request, response, path) {
    return admin.database().ref(path).remove().then(() => {
        const responseBody = {
            "status": "OK"
        };
        return response.json(responseBody);
    });
}

// --- USER TABLE ----

//create user
api.post('/api/v1/user', (request, response) => {
    save(request, response, '/user',request.body)

});

//get all users and return list
api.get('/api/v1/user', (request, response) => {
    findAll(request, response, '/country')
});

//get a certain number of users
api.get('/api/v1/user/', (request, response) => {
    findToALimit(request, response, '/user', request.params.limit)
});

//get user by ID
api.get('/api/v1/user/:user_id', (request, response) => {
    findById(request, response, '/user/'+request.params.user_id)
});

//get user by ID
api.get('/api/v1/user/check-exists/:user_id', (request, response) => {
    checkExists(request, response, 'user', request.params.user_id)
});

//update user
api.patch('/api/v1/user/:user_id', (request, response) => {
    update(request, response,'/user/'+request.params.user_id, request.body)

});

//delete user
api.delete('/api/v1/user/:user_id', (request, response) => {
    deleteById(request, response,'/user/'+request.params.user_id)
});

// --- COUNTRY TABLE ----

/**
 Create a new county in the country table
 @param JSON body with the following params:
 country_name
 */
api.post('/api/v1/country', (request, response) => {
    // const country = new Country(request.body);
    save(request, response, '/country',request.body)

});

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

//update country
api.patch('/api/v1/country/:country_id', (request, response) => {
    update(request, response,'/country/'+request.params.country_id, request.body)

});

//delete country
api.delete('/api/v1/country/:country_id', (request, response) => {
    deleteById(request, response,'/country/'+request.params.country_id)
});

// --- UNIVERSITY TABLE ----

api.post('/api/v1/university', (request, response) => {
    save(request, response, '/university',request.body)

});

//return list of universities
api.get('/api/v1/university', (request, response) => {
    findAll(request, response, '/university')
});

//return list of universities by country_id
api.get('/api/v1/university/country/:country_id', (request, response) => {
    findByColumn(request, response, '/university', 'country_id', request.params.country_id)
});


exports.api = functions.https.onRequest(api);
