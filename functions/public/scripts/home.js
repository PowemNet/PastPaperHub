'use strict';

/**
 * set up UI elements from html

 */
//header
const userPic = document.getElementById('user-pic');
const userName = document.getElementById('user-name');
const signOutButton = document.getElementById('sign-out');
const signInSnackbar = document.getElementById('must-signin-snackbar');

//drop down
const dropDownUniversity = document.getElementById('drop-down-university');
const dropDownYear = document.getElementById('drop-down-year');
const dropDownCourse = document.getElementById('drop-down-course');

//search card
const searchSelectItem = document.getElementById('search-select-item');
const pleaseWaitText = document.getElementById('please-wait-text');
const searchButton = document.getElementById('search-button');

//search results
const pleaseWaitTextSearchResults = document.getElementById('please-wait-text-search-results');
const searchResultsList = document.getElementById('search-results-list');

//set on click listeners
searchButton.addEventListener('click', onSearchButtonClicked.bind(this))
signOutButton.addEventListener('click', this.signOut.bind(this));

var user;

function PastPaperHub() {
    this.init();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
PastPaperHub.prototype.init = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.messaging = firebase.messaging();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

PastPaperHub.prototype.authStateObserver = async function(facebookUser) {
    if (facebookUser) {
        await setUpHeaderAndUserData(facebookUser)
        await setUpSearchUi();

    } else { // User is signed out!
        window.location.href = "/login";
    }

    // Load existing past papers.
    loadPastPapers();
};

async function setUpHeaderAndUserData(facebookUser) {
    user = await fetchAndIntialiseUserData(facebookUser.uid);
    setUpHeaderUi(user)
    await initDropDownMenu(user);
}

async function fetchAndIntialiseUserData (facebookUserId) {
    await httpGet(`/api/v1/user/` + facebookUserId).then(res => {
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

function setUpHeaderUi(user) {
    // Set the user's profile pic and name.
    userPic.style.backgroundImage = 'url(' + (user.profilePicUrl || '/images/profile_placeholder.png') + ')';
    userName.textContent = user.displayName;

    // Show user's profile and sign-out button.
    userName.removeAttribute('hidden');
    userPic.removeAttribute('hidden');
}

function initDropDownMenu(user) {
    return new Promise((resolve, reject) => {
        if (user.university!== null){
            dropDownUniversity.textContent = user.university
        }
        if (user.course!== null){
            dropDownCourse.textContent = user.course
        }
        if (user.year!== null){
            dropDownYear.textContent = "Year " + user.year
        }
        resolve();
    });
}

var courseUnitList
var courseUnitNameList = []
var courseUnitIdList = []
async function setUpSearchUi() {
    await httpGet(`/api/v1/course_unit/course/` + user.course).then(res => {
        courseUnitList = JSON.parse(JSON.stringify(res))
        courseUnitList.forEach(function(element) {
            courseUnitNameList.push(element["data"]["course_unit_name"])
            courseUnitIdList.push(element["key"])
        });

        console.log(courseUnitNameList)
        return courseUnitNameList
    }).catch(error => console.error(error))

    var i;
    for (i = 0; i < courseUnitNameList.length; i++) {
        var option = document.createElement("option");
        option.textContent = courseUnitNameList[i];
        option.value = courseUnitIdList[i];
        searchSelectItem.appendChild(option);
    }
    pleaseWaitText.textContent = "Select from list:"

}

async function onSearchButtonClicked() {
    await fetchPastPapers()
    showSearchResults()
}

var pastPaperList
var pastPaperNameList = []
var pastPaperIdList = []
async function fetchPastPapers(courseUnitId) {
    if (userHasSelectedItem()){
        await httpGet(`/api/v1/past_paper/course_unit/` + courseUnitId).then(res => {
            pastPaperList = JSON.parse(JSON.stringify(res))
            pastPaperList.forEach(function(element) {
                pastPaperNameList.push(element["data"]["past_paper_name"])
                pastPaperIdList.push(element["key"])
                var pastPaper = new PastPaper()
                //todo set up object here
                showSearchResult(pastPaper)
            });

            console.log(pastPaperList)
            return pastPaperList
        }).catch(error => console.error(error))
    } else {
        alert("Please select an option")
    }

}
function showSearchResult(pastPaper) {
    pleaseWaitTextSearchResults.style.visibility = "hidden"

        var li = document.createElement("li");
        var a = document.createElement("a");

        a.textContent = pastPaper.pastPaperName;
        a.setAttribute('href', "/questions" + pastPaper.id);  //todo.. add pp id to link in href.. let questions page load according to what's in the link
        li.appendChild(a);

}

function userHasSelectedItem(){
    return searchSelectItem.value !== ""
}

function signOut() {
  this.auth.signOut();
}

// Returns true if a user is signed-in.
PastPaperHub.prototype.isUserSignedIn = function() {
  return !!this.auth.currentUser;
}

var hardCodedPastPaperDbRef = '/pastpapers/university/makerere/comp_eng/year_1/electronics/';
// Loads pastpapers and listens for upcoming ones.
function loadPastPapers() {
  // var setItem = function(snap) {
  //     var li = document.createElement("li");
  //     var a = document.createElement("a");
  //     var data = snap.val();
  //
  //     a.textContent = data.title;
  //     a.setAttribute('href', "/questions");
  //     li.appendChild(a);
  //     li.onclick = function(){
  //       var pastPaperClickedDbRef = hardCodedPastPaperDbRef + snap.key;
  //       localStorage.setItem("pastPaperClickedDbRef", pastPaperClickedDbRef);
  //       localStorage.setItem("pastPaperClickedText", data.title);
  //     }
  //     pastPaperList.appendChild(li);
  //     pleaseWaitText.style.visibility = "hidden";
  // }.bind(this)
  //
  // this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_added', setItem);
  // this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_changed', setItem);
}

// Returns true if user is signed-in. Otherwise false and displays a message.
PastPaperHub.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.isUserSignedIn()) {
    return true;  //todo check if user is actually signed in
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Resets the given MaterialTextField.
PastPaperHub.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// A loading image URL.
PastPaperHub.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Enables or disables the submit button depending on the values of the input
// fields.
PastPaperHub.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

window.addEventListener('load' , function() {
  window.PastPaperHub = new PastPaperHub();
});
