'use strict';

const signInSnackbar = document.getElementById('must-signin-snackbar');

const leftContentList = document.getElementById('left-content-list');
const rightContentList = document.getElementById('right-content-list');

const pastPaperId = document.getElementById('past-paper-id');

var user;

function Questions() {
    this.init();
}

Questions.prototype.init = function () {
    this.auth = firebase.auth();
    this.database = firebase.database();

    this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

var questionList = [];
Questions.prototype.authStateObserver = async function (facebookUser) {
    if (facebookUser) {
        await setUpheaderAndUserData(facebookUser)
        await fetchQuestionsFromDb(pastPaperId.textContent);
        await setUpUi(questionList)
    } else {
        launchHomeScreen();
    }
};

async function setUpheaderAndUserData(facebookUser) {
    user = await fetchAndIntialiseUserData(facebookUser.uid);
}

async function fetchAndIntialiseUserData(facebookUserId) {
    await httpGet("/api/v1/user/" + facebookUserId).then(res => {
        res = JSON.parse(JSON.stringify(res))

        user = new User()
        user.id = res["key"]
        user.country = res["data"]["country"]
        user.course = res["data"]["course"]
        user.displayName = res["data"]["displayName"]
        user.profilePicUrl = res["data"]["profilePicUrl"]
        user.profileSet = res["data"]["profile_set"]
        user.university = res["data"]["university"]
        user.year = res["data"]["year"]

        return user
    }).catch(error => console.error(error))

    return user
}

var returnedList
async function fetchQuestionsFromDb(pastPaperId) {

    var url = "/api/v1/question/past_paper/" + pastPaperId.replace(" ", "");
    await httpGet(url).then(res => {
        returnedList = JSON.parse(JSON.stringify(res));
        returnedList.forEach(function(element) {
            var question = new Question();  //todo automatically deserialise json into JS object
            question.id = element["key"];
            question.questionNumber = element["data"]["question_number"];
            question.questionName = element["data"]["question_name"];
            question.commentsId = element["data"]["comments_id"];
            questionList.push(question)
        });

        console.log(questionList)
        return questionList
    }).catch(error => console.error(error))
}

function setUpUi(questionList) {
    var i;
    for (i = 0; i < questionList.length; i++) {

        //set up question title
        var h5 = document.createElement("h5");
        h5.textContent = questionList[i].questionName;

        //set up facebook comments
        loadFacebookAPI();

        var commentsDiv = document.createElement("div");
        commentsDiv.setAttribute('id', "comments-div");
        commentsDiv.setAttribute('class', "fb-comments");
        commentsDiv.setAttribute('data-numposts', "5");
        commentsDiv.setAttribute('data-href', questionList[i].commentsId);

        //set up right content div
        var div = document.createElement("div");
        div.setAttribute('id', i); //set id to be used by left content
        div.setAttribute('class',
            "pbox");
        div.appendChild(h5)
        div.appendChild(commentsDiv)
        rightContentList.appendChild(div);


        //set up left content
        var p = document.createElement("p");
        var a = document.createElement("a");

        a.textContent = questionList[i].questionNumber;
        a.setAttribute('href', "#");
        a.setAttribute('data-id', i);
        if (i === 0 ) {
            a.setAttribute('class', "current");
        }
        p.appendChild(a);
        leftContentList.appendChild(p);
    }

}

function loadFacebookAPI() {
    var js = document.createElement('script');
    js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=YOUR_APP_ID&version=v2.0';
    document.body.appendChild(js);
}

function launchHomeScreen() {
    window.location.href = "/";
}

// todo this looks like it will be usefull
function checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (this.isUserSignedIn()) {
        return true;
    }

    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign-in first',
        timeout: 2000
    };
    signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
}

// A loading image URL.
Questions.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

window.addEventListener('load', function () {
    window.Questions = new Questions();
});

