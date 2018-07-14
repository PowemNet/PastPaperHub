'use strict';

function Login() {
  this.signInButton = document.getElementById('sign-in');
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.initFirebase();
}

var university = "";
var userProfileIsSet = false;

Login.prototype.initFirebase = function () {
  this.auth = firebase.auth();
};

Login.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
};

var user;

Login.prototype.signIn = function () {
  var self = this;
  var provider = new firebase.auth.FacebookAuthProvider();
  this.auth.signInWithPopup(provider).then(function (result) {
    var token = result.credential.accessToken;
    user = result.user;
    if (!self.userExistsInDb()) {
      self.addUserToUsersDb(user);
      self.checkForProfile();
    } else {
      self.checkForProfile();
    }

  }).catch(function (error) {
    var errorMessage = error.message;
    console.log("error logging in: " + errorMessage);
  });
};

Login.prototype.userExistsInDb = function () {
  return true;
};

Login.prototype.getUniversity = function () {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.getUniversityFromDb();  
    resolve("get Univeristy db Promise completed successfully");
  });
}

Login.prototype.checkForProfile = async function () {
  await this.getUniversityFromDb();
  this.setUserProfileBoolean();
  if (userProfileIsSet) {
    this.launchHomeScreen();
  } else {
    this.launchProfileScreen();
  }
}

Login.prototype.getUniversityFromDb = function () { 
  console.log("getUniversityFromDb");
  return firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
  university = (snapshot.val() && snapshot.val().university) || 'NOT_SET';
  console.log("1");
    console.log(university);
  });
};

Login.prototype.setUserProfileBoolean = function () { 
  console.log("setUserProfileBoolean");
  console.log("2");
  if (university != "NOT_SET") {
    userProfileIsSet = true;
  }
console.log("User profile set? " + userProfileIsSet);
};

Login.prototype.launchHomeScreen = function () {
  window.location.href = "/";
};

Login.prototype.launchProfileScreen = function () {
  window.location.href = "/profile";
};

Login.prototype.addUserToUsersDb = function (user) {
  return this.database.ref('users/' + user.uid).set({
    displayName: user.displayName,
    profilePicUrl: user.photoURL,
    year: "NOT_SET",
    course: "NOT_SET",
    university: "NOT_SET"
  }).catch(function (error) {
    console.error('Error adding new user to Firebase Database', error);
  });
};

window.addEventListener('load', function () {
  window.Login = new Login();
});
