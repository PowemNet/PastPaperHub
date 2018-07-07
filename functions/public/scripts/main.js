'use strict';

// Initializes Main.
function Main() {
  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Main.prototype.initFirebase = function() {
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Main.prototype.authStateObserver = function(user) {
  if (user) { 
    console.log("User logged in!");
   } 
  else { // User is signed out! show login page
    console.log("User logged out!"); 
  }
};

window.addEventListener('load' , function() {
  window.Main = new Main();
});
