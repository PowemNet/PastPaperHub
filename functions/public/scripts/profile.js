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

  this.initFirebase();
}

Profile.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
//   this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

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
