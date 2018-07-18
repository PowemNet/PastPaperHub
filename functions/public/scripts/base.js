'use strict';

// Initializes FriendlyChat.
function Base() {
  this.initFirebase();
}

Base.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

Base.prototype.authStateObserver = function(user) {
  if (user) { 
    //update set user object

    // this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // this.showLoginScreen();
  }
};

// // Returns true if user is signed-in. Otherwise false and displays a message.
// Base.prototype.checkSignedInWithMessage = function() {
//   // Return true if the user is signed in Firebase
//   if (this.isUserSignedIn()) {
//     return true;
//   }

//   // Display a message to the user using a Toast.
//   var data = {
//     message: 'You must sign-in first',
//     timeout: 2000
//   };
//   this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
//   return false;
// };

window.addEventListener('load' , function() {
  window.Base = new Base();
});
