'use strict';
function Profile() {
  this.yearInput = document.getElementById('year');
  this.courseInput = document.getElementById('course');
  this.universityInput = document.getElementById('university');

  this.dropDownUniversity = document.getElementById('drop-down-university');
  this.dropDownYear = document.getElementById('drop-down-year');
  this.dropDownCourse = document.getElementById('drop-down-course');



  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.initFirebaseAndSetUpData();
}

//init UI
const profileCardTitle = document.getElementById('profile-card-title');
const profileCardSelectItem = document.getElementById('profile-select-item');
const profileCardPleaseWaitText = document.getElementById('please-wait-text');
const profileCardNextButon = document.getElementById('profile-card-next');

//set on click listeners
profileCardNextButon.addEventListener('click', onNextButtonClicked.bind(this))

var currentCard = ""
var itemSelectedJsonBody

var user;
var country = new Country();
var university = new University();
var year;
var course;

//constants
const COUNTRY = "country"
const UNIVERSITY = "university"
const YEAR = "year"
const COURSE = "course"

Profile.prototype.initFirebaseAndSetUpData = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

Profile.prototype.authStateObserver = async function (userObject) {
  if (userObject) {
    user = userObject; //set user global object
    console.log(user);
    await this.fetchUserMetadata();
    await this.initDropDownMenu();
    await setUpProfileCard();
  } else {
    this.showLoginScreen();  //todo seriously set this!
  }
};

Profile.prototype.fetchUserMetadata = function () {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
      if(snapshot){
        course = (snapshot.val() && snapshot.val().course);
        university = (snapshot.val() && snapshot.val().university);
        year = (snapshot.val() && snapshot.val().year);
        resolve();
        return snapshot;
      }
      else{
        throw new Error("error getUniversityFromDb" );
      }
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log("error getUniversityFromDb:" + errorMessage);
    });
  });
};

Profile.prototype.initDropDownMenu = function () {
  return new Promise((resolve, reject) => {

    if (university!== null){
        this.dropDownUniversity.textContent = university
    }
    if (year!== null){
          this.dropDownYear.textContent = year
    }
    if (course!== null){
          this.dropDownCourse.textContent = course
    }

    resolve();
  });

};

/**
 * Set up..
 *
 */

function  setUpProfileCard() {
  //todo use when clause here

    resetCardUI("Please Wait...")
    console.log("resetCardUI-----")

    if(currentCard === ""){
        showCountryCard()
    }
    else if(currentCard === COUNTRY) {
        showUniversityCard()
    }
    else if(currentCard === UNIVERSITY) {
        showYearCard()
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

    updateLocalVariableForType (itemSelectedValue, itemSelectedText)
    obj[key] = itemSelectedText;
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

// var yearList = []
async function showYearCard() {
    profileCardTitle.textContent = "Which Year are you?"

    var i;
    for (i = 0; i < universityList.length; i++) {
        if (universityList[i]["key"] === university.id){
            console.log("FOR LOOP---"+ universityList[i]["data"]["years"])
            break;
        }
    }

    profileCardPleaseWaitText.textContent = "Select from list:"
    currentCard = YEAR

    // await httpGet(`/api/v1/university/country/` + country.id).then(res => {
    //     universityList = JSON.parse(JSON.stringify(res))
    //
    //     var i;
    //     for (i = 0; i < universityList.length; i++) {
    //         console.log("length---"+ universityList.length)
    //         universityNameList[i] = universityList[i]["data"]["university_name"]
    //         universityIdList[i] = universityList[i]["key"]
    //     }
    //
    //     return universityNameList
    // }).catch(error => console.error(error))
    //
    // var i;
    // for (i = 0; i < countryNameList.length; i++) {
    //     var option = document.createElement("option");
    //
    //     option.textContent = universityNameList[i];
    //     option.value = universityIdList[i];
    //     profileCardSelectItem.appendChild(option);
    // }
    //
    // profileCardPleaseWaitText.textContent = "Select from list:"
    //
    // currentCard = "university"

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

    if (userHasSelectedItem()){
      await httpPatch(`/api/v1/user/` + user.uid, generateJsonForItemSelected()).then(res => {
          user = JSON.parse(JSON.stringify(res));
          console.log("updated User: " + user);
          setUpProfileCard()
          return user
      }).catch(error => console.error(error))
  } else {
    alert("Please select an option")
  }
}

function userHasSelectedItem(){
  return profileCardSelectItem.value !== ""
}

function updateLocalVariableForType(value, itemSelectedText) {
    if (currentCard === COUNTRY) {
        country.id = value;
        country.name = itemSelectedText
    }
    else if (currentCard === UNIVERSITY) {
        university = new University()
        university.id = value;
        university.name = itemSelectedText;
        university.countryId = country.id
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

window.addEventListener('load' , function() {
  window.Profile = new Profile();
});
