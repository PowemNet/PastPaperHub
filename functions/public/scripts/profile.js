'use strict';
function Profile() {
  this.saveButton = document.getElementById('save-profile');
  this.yearInput = document.getElementById('year');
  this.courseInput = document.getElementById('course');
  this.universityInput = document.getElementById('university');

  this.dropDownUniversity = document.getElementById('drop-down-university');
  this.dropDownYear = document.getElementById('drop-down-year');
  this.dropDownCourse = document.getElementById('drop-down-course');



    this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.saveButton.addEventListener('click', this.onProfileFormSubmit.bind(this));

  this.initFirebaseAndSetUpData();
}

//profile card

const profileCardTitle = document.getElementById('profile-card-title');
const profileSelectItem = document.getElementById('profile-select-item');

var user;
var course;
var university;
var year;

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
    await setUpProfileCard("country");  //set up profile card with country first
  } else {
    this.showLoginScreen();
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

async function  setUpProfileCard(item) {
  //todo use when clause here
    if(item === "country"){
        profileCardTitle.textContent = "In which country are you studying?"
        var countryList
        var countryNameList = []

        await httpGet(`/api/v1/country`).then(res => {
            countryList = JSON.parse(JSON.stringify(res))
            countryList.forEach(function(element) {
                countryNameList.push(element["data"]["country_name"])
            });

            console.log(countryNameList)
            return countryNameList
        }).catch(error => console.error(error))

        console.log(countryNameList)
        countryNameList.forEach(function(element) {
            var option = document.createElement("option");
            option.textContent = element;
            option.value = element;
            profileSelectItem.appendChild(option);
        });

    }
}

Profile.prototype.selectElement = function (id, valueToSelect)
{    
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

const dbRef = firebase.database().ref();

Profile.prototype.saveProfile = function (year, course, university) {
  var self = this;
  return this.database.ref('/users/'+user.uid).update({
    year: year,
    course: course,
    university: university
  }, function (error) {
    if (error) {
      console.log("failed to update");
    } else {
      var data = {
        message: 'Profile saved!',
        timeout: 2000
      };
      //self.signInSnackbar.MaterialSnackbar.showSnackbar(data);
      window.history.back();
    }
  });
};

Profile.prototype.onProfileFormSubmit = function(e) {
  e.preventDefault();
  if (this.checkSignedIn()) {
    this.saveProfile(
        this.yearInput.value, 
        this.courseInput.value, 
        this.universityInput.value).then(function() {
    }.bind(this)).catch(function(error) {
      console.error('Error: ', error);
    });
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Profile.prototype.checkSignedIn = function() {
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
