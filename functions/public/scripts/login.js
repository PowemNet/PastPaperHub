'use strict';

function Login() {
  this.signInButton = document.getElementById('sign-in');
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.initFirebase();
}

var user;
var university = "";
var userProfileIsSet = false;
const dbRef = firebase.database().ref();

Login.prototype.initFirebase = function () {
  this.auth = firebase.auth();
};

Login.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
};

var userExists = false;

Login.prototype.signIn = async function () {
  var self = this;
  await this.signInWithFacebook();
  await this.checkIfUserExistsInDb();
  this.sampleFunction();
  console.log("-----esits???  "+userExists);
  if (!userExists) {
    console.log("Adding user--");
    this.addUserToUsersDb(user);
    // this.checkForProfile();
  } else {
    console.log("NOT Adding user--");
    // this.checkForProfile();
  }
  return "done!!";
};

Login.prototype.signInWithFacebook = function () {
  return new Promise((resolve, reject) => {
    console.log("signInWithFacebook");
    var provider = new firebase.auth.FacebookAuthProvider();
    this.auth.signInWithPopup(provider).then(function (result) {
      var token = result.credential.accessToken;
      user = result.user;
      console.log("created user object");
      resolve();
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log("error logging in: " + errorMessage);
    });
  })
}

Login.prototype.checkIfUserExistsInDb = function () {
  console.log("checkIfUserExistsInDb");
  return new Promise((resolve, reject) => {
    dbRef.child('users').child(user.uid).once('value', function (snapshot) {
      var exists = (snapshot.val() !== null);
      console.log("EXISTS???  " + exists);
      return exists;
    });
  })
};

Login.prototype.getUniversity = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
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
    console.log(university);
  });
};

Login.prototype.setUserProfileBoolean = function () {
  console.log("setUserProfileBoolean");
  if (university != "NOT_SET") {
    userProfileIsSet = true;
  }
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
