'use strict';

function Login() {
  this.signInButton = document.getElementById('sign-in');
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.initFirebase();
}

Login.prototype.initFirebase = function() {
  this.auth = firebase.auth();
};

Login.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.database = firebase.database();
};

Login.prototype.signIn = function() {
  var self = this;
  var provider = new firebase.auth.FacebookAuthProvider();
  this.auth.signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    //if first time user, create new user node uder users node in firebase db
    if(!self.userExists()){
        self.addUserToUsersDb(user);
        // self.launchHomeScreen();
    } else {
      self.launchHomeScreen();
    }
  }).catch(function(error) {
    var errorMessage = error.message;
    console.log("error logging in: "+errorMessage);
  });
};

Login.prototype.userExists = function() {
  return false;
};

Login.prototype.launchHomeScreen = function() {
  window.location.href = "/";
};

Login.prototype.addUserToUsersDb = function(user) {
  return this.database.ref('users/' + user.uid).set({
    displayName: user.displayName,
    profilePicUrl: user.photoURL
  }).catch(function(error) {
    console.error('Error adding new user to Firebase Database', error);
  });
};

window.addEventListener('load' , function() {
  window.Login = new Login();
});
