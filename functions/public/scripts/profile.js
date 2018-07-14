'use strict';

// Initializes FriendlyChat.
function Profile() {
  // Shortcuts to DOM Elements.
  this.profileForm = document.getElementById('profile-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
  this.profileForm.addEventListener('submit', this.onProfileFormSubmit.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Profile.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

// Saves a new message on the Firebase DB.
Profile.prototype.saveProfile = function(messageText) { //todo : continue from here
  // Add a new message entry to the Firebase Database.
  return this.database.ref('/messages/').push({
    name: this.getUserName(),
    text: messageText,
    profilePicUrl: this.getProfilePicUrl()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};

// Triggered when the send new message form is submitted.
Profile.prototype.onProfileFormSubmit = function(e) {
  e.preventDefault();
  if (this.checkSignedIn()) {
    this.saveProfile("dummy text").then(function() {
    }.bind(this));
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Profile.prototype.checkSignedIn = function() {
  // Return true if the user is signed in Firebase
  if (this.isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

window.addEventListener('load' , function() {
  window.friendlyChat = new Profile();
});
