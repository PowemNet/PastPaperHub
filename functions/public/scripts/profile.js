'use strict';
// Initializes FriendlyChat.
function Profile() {
  // Shortcuts to DOM Elements.
  this.profileForm = document.getElementById('profile-form');
  this.saveButton = document.getElementById('save-profile');
  this.yearInput = document.getElementById('year');
  this.courseInput = document.getElementById('course');
  this.universityInput = document.getElementById('university');
  this.submitButton = document.getElementById('submit');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
//   this.profileForm.addEventListener('submit', this.onProfileFormSubmit.bind(this));
  this.saveButton.addEventListener('click', this.onProfileFormSubmit.bind(this));

  this.initFirebaseAndSetUpData();
}

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
    await this.initUI();
    // this.saveMessagingDeviceToken();
  } else { 
    this.showLoginScreen();
  }
};

Profile.prototype.fetchUserMetadata = function () {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
      course = (snapshot.val() && snapshot.val().course) || 'NOT_SET';
      university = (snapshot.val() && snapshot.val().university) || 'NOT_SET';
      year = (snapshot.val() && snapshot.val().year) || 'NOT_SET';
    });
    resolve();
  });
};

Profile.prototype.initUI = function () {
  return new Promise((resolve, reject) => {
    this.selectElement("course", course);
    this.selectElement("university", university);
    this.selectElement("year", year);
    resolve();
  });

};

Profile.prototype.selectElement = function (id, valueToSelect)
{    
    var element = document.getElementById(id);
    element.value = valueToSelect;
}



const dbRef = firebase.database().ref();

// Saves profile on the Firebase DB.
Profile.prototype.saveProfile = function (year, course, university) { //todo : continue from here
    return this.database.ref('/users/bMfuLi40eYdEl9dsO0bRVCOQvxG2').update({ //TODO USER  user.id
        year: year,
        course: course,
        university: university
    }).catch(function (error) {
        console.error('Error updating profile', error);
    });
};

// Triggered when the send new message form is submitted.
Profile.prototype.onProfileFormSubmit = function(e) {
  e.preventDefault();
  if (this.checkSignedIn()) {
    this.saveProfile(
        this.yearInput.value, 
        this.courseInput.value, 
        this.universityInput.value).then(function() {
    }.bind(this));
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Profile.prototype.checkSignedIn = function() {
  // Return true if the user is signed in Firebase
//   if (this.isUserSignedIn()) {
//     return true;
//   } //    TODO UNCOMMNET THIS AND IMPLEMENT IT!

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
