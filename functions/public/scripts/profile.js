'use strict';

/**
 * set up UI elements from html

 */
//drop down
const dropDownUniversity = document.getElementById('drop-down-university');
const dropDownYear = document.getElementById('drop-down-year');
const dropDownCourse = document.getElementById('drop-down-course');

//profile card
const profileCardTitle = document.getElementById('profile-card-title');
const profileCardSelectItem = document.getElementById('profile-select-item');
const profileCardPleaseWaitText = document.getElementById('please-wait-text');
const profileCardNextButon = document.getElementById('profile-card-next');

//snack bar
const signInSnackbar = document.getElementById('must-signin-snackbar');

/**
 * set up Constants
 * //todo extract these to a different file
 */
const COUNTRY = "country"
const UNIVERSITY = "university"
const YEAR = "year"
const COURSE = "course"

//set on click listeners
profileCardNextButon.addEventListener('click', onNextButtonClicked.bind(this))

var currentCard = ""  //todo refactor this. there are too many class level variables floating around. variables should be passed around in methods

var user;
var country;
var university;
var year;
var course;

function Profile() {
    this.initFirebaseAndSetUpData();
}


Profile.prototype.initFirebaseAndSetUpData = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

Profile.prototype.authStateObserver = async function (facebookUser) {
  if (facebookUser) {
    await setUpheaderAndUserData(facebookUser)
    await setUpProfileCard();
  } else {
    this.lauchLoginScreen();  //todo seriously set this!
  }
};

async function setUpheaderAndUserData(facebookUser) {
    user = facebookUser  //todo change user.uid usages to use user.id from firebase.. delete this line
    await fetchUserMetadata(facebookUser.uid);
    await initDropDownMenu();
}

async function fetchUserMetadata (facebookUserId) {
    await httpGet(`/api/v1/user/` + facebookUserId).then(res => {
        user = JSON.parse(JSON.stringify(res))
        console.log ("#########USER---" +user)
        console.log ("#########USER---" +user.key)
        console.log ("#########USER---" +user.data)
        console.log ("#########USER---" +user["data"]["country"])

        return universityNameList
    }).catch(error => console.error(error))
}

function initDropDownMenu(university, course, year) {
  return new Promise((resolve, reject) => {

    if (university!== null){
        dropDownUniversity.textContent = university
    }
    if (course!== null){
          dropDownCourse.textContent = course
     }
    if (year!== null){
          dropDownYear.textContent = year
    }
    resolve();
  });

}

/**
 * Set up..
 *
 */

function  setUpProfileCard() {
  //todo use when clause here

    resetCardUI("Please Wait...")

    if(currentCard === ""){
        showCountryCard()
    }
    else if(currentCard === COUNTRY) {
        showUniversityCard()
    }
    else if(currentCard === UNIVERSITY) {
        showCourseCard()

    }
    else if(currentCard === COURSE) {
        showYearCard()
    }
    else if(currentCard === YEAR) {
        launchHomeScreen()
    }
}

var countryList
var countryNameList = []
var countryIdList = []
async function showCountryCard() {
    profileCardTitle.textContent = "In which Country are you studying?"

    await httpGet(`/api/v1/country`).then(res => {
        countryList = JSON.parse(JSON.stringify(res))
        countryList.forEach(function(element) {
            countryNameList.push(element["data"]["country_name"])
            countryIdList.push(element["key"])
        });

        console.log(countryNameList)
        return countryNameList
    }).catch(error => console.error(error))

        var i;
        for (i = 0; i < countryNameList.length; i++) {
            var option = document.createElement("option");
            option.textContent = countryNameList[i];
            option.value = countryIdList[i];
            profileCardSelectItem.appendChild(option);
        }
    profileCardPleaseWaitText.textContent = "Select from list:"

    currentCard = COUNTRY

}

function generateJsonForItemSelected(){
    var key = currentCard
    var obj = {};
    var itemSelectedText = profileCardSelectItem.options[profileCardSelectItem.selectedIndex].text
    var itemSelectedValue = profileCardSelectItem.value

    initialiseDataObjects (itemSelectedValue, itemSelectedText)
    obj[key] = itemSelectedText;
    if (currentCard === YEAR){ //set profile flag
        obj["profile_set"] = true
    }
    const generateJsonForItemSelected = JSON.stringify(obj)
    return generateJsonForItemSelected;
}

function generateJsonForSettingProfileFlag(flagValue){
    var key = "profile_set"
    var obj = {};
    var value = flagValue

    obj[key] = value;
    return JSON.stringify(obj);
}

var universityList = [];
var universityNameList = [];
var universityIdList = [];
async function showUniversityCard() {
    profileCardTitle.textContent = "Which University do you go to?"

    await httpGet(`/api/v1/university/country/` + country.id).then(res => {
        universityList = JSON.parse(JSON.stringify(res))

        var i;
        for (i = 0; i < universityList.length; i++) {
            universityNameList[i] = universityList[i]["data"]["university_name"]
            universityIdList[i] = universityList[i]["key"]
        }

        return universityNameList
         }).catch(error => console.error(error))

        var i;
        for (i = 0; i < universityList.length; i++) {
            var option = document.createElement("option");

            option.textContent = universityNameList[i];
            option.value = universityIdList[i];
            profileCardSelectItem.appendChild(option);
        }

    profileCardPleaseWaitText.textContent = "Select from list:"
    currentCard = UNIVERSITY

}

var courseList = [];
var courseNameList = [];
var courseIdList = [];
async function showCourseCard() {
    profileCardTitle.textContent = "Which Course do you do?"

    await httpGet(`/api/v1/course/university/` + university.id).then(res => {
        courseList = JSON.parse(JSON.stringify(res))

        var i;
        for (i = 0; i < courseList.length; i++) {
            courseNameList[i] = courseList[i]["data"]["course_name"]
            courseIdList[i] = courseList[i]["key"]
        }

        return courseList
    }).catch(error => console.error(error))

    var i;
    for (i = 0; i < courseList.length; i++) {
        var option = document.createElement("option");

        option.textContent = courseNameList[i];
        option.value = courseIdList[i];
        profileCardSelectItem.appendChild(option);
    }

    profileCardPleaseWaitText.textContent = "Select from list:"
    currentCard = COURSE
}

var yearList = [];
async function showYearCard() {
    profileCardTitle.textContent = "Which Year are you?"

    var i;
    for (i = 0; i < courseList.length; i++) {
        if (courseList[i]["key"] === course.id){
            yearList =  courseList[i]["data"]["years"]
            break;
        }
    }

    for (i = 0; i < yearList.length; i++) {
        var option = document.createElement("option");

        option.textContent = yearList[i];
        option.value = yearList[i];
        profileCardSelectItem.appendChild(option);
    }

    profileCardPleaseWaitText.textContent = "Select from list:"
    currentCard = YEAR
}

function resetCardUI(text){
    profileCardSelectItem.options.length = 1;
    profileCardPleaseWaitText.textContent = text
}


Profile.prototype.selectElement = function (id, valueToSelect)
{    
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

const dbRef = firebase.database().ref();

async function updateUserProfile() {
    console.log("updating with userID:----- " + user.uid)
    if (userHasSelectedItem()){
      await httpPatch(`/api/v1/user/` + user.uid, generateJsonForItemSelected()).then(res => {
          setUpProfileCard()
          return JSON.stringify(res)
      }).catch(error => console.error(error))
  } else {
    alert("Please select an option")
  }
}

function userHasSelectedItem(){
  return profileCardSelectItem.value !== ""
}

function initialiseDataObjects(value, itemSelectedText) {
    if (currentCard === COUNTRY) {
        country = new Country()
        country.id = value;
        country.name = itemSelectedText
    }
    else if (currentCard === UNIVERSITY) {
        university = new University()
        university.id = value;
        university.name = itemSelectedText;
        university.countryId = country.id
    }
    else if (currentCard === COURSE) {
        course = new Course()
        course.id = value;
        course.name = itemSelectedText;
        course.universityId = university.id
    }
}

function onNextButtonClicked() {
  // e.preventDefault();
  if (checkSignedIn()) {
    updateUserProfile()
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedIn() {
  // Return true if the user is signed in Firebase
//   if (this.isUserSignedIn()) {
//     return true;
//   } //    TODO UNCOMMENT THIS AND IMPLEMENT IT!

    return true;

//   // Display a message to the user using a Toast.
//   var data = {
//     message: 'You must sign-in first',
//     timeout: 2000
//   };
//   this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
//   return false;
};

function launchHomeScreen () {
    window.location.href = "/";
}

window.addEventListener('load' , function() {
  window.Profile = new Profile();
});
