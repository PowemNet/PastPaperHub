'use strict';

// Initializes PastPaperHub.
function Header() {
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Header.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();

  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Header.prototype.authStateObserver = function(authUser) {
  if (authUser) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = this.getProfilePicUrl();
    var userName = this.getUserName();

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');

    //set up header drop down menu

    //set up firebase db user object for use in other scripts


  } else { // User is signed out!
    window.location.href = "/login";
  }
};

// Returns the signed-in user's profile Pic URL.
Header.prototype.getProfilePicUrl = function() {
  return this.auth.currentUser.photoURL || 'images/profile_placeholder.png'; //todo check why this doesnt work
}

// Returns the signed-in user's display name.
Header.prototype.getUserName = function() {
  return this.auth.currentUser.displayName;
}

window.addEventListener('load' , function() {
  window.PastPaperHub = new Header();
});
