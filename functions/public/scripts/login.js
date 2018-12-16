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

var userExists;

Login.prototype.signIn = async function () {
  var self = this;
  await this.signInWithFacebook();
  await this.checkIfUserExistsInDb();
  if (!userExists) {
    console.log("Adding user--");
    this.addUserToUsersDb(user);
    this.checkForProfile();
  } else {
    console.log("NOT Adding user--");
    this.checkForProfile();
  }
  return "done!!"; //test if this is really required here
};

Login.prototype.signInWithFacebook = function () {
  return new Promise((resolve, reject) => {
    console.log("signInWithFacebook");
    var provider = new firebase.auth.FacebookAuthProvider();
    this.auth.signInWithPopup(provider).then(function (result) {
      if (result){
        var token = result.credential.accessToken;
        user = result.user;
        console.log("created user object");
        resolve();
        return user;
      }
      else{
        throw new Error("error logging in" );
      }

    }).catch(function (error) {
      var errorMessage = error.message;
      console.log("error logging in: " + errorMessage);
    });
  })
}

Login.prototype.checkIfUserExistsInDb = function () {
  console.log("checkIfUserExistsInDb");
  return new Promise((resolve, reject) => {
      fetch(`http://localhost:5005/api/v1/user/check-exists/`+user.uid)
          .then(data => data.json())
          .then(res => {
              userExists = res.exists
          })
          .catch(error => console.error(error))

      resolve();
  })
};


Login.prototype.getUniversity = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.getUniversityFromDb();
    resolve("get Univeristy db Promise completed successfully"); //
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
    if(snapshot){
      university = (snapshot.val() && snapshot.val().university) || 'NOT_SET';
      console.log(university);
      return university;
    }
    else{
      throw new Error("error getUniversityFromDb" );
    }
  });
};

Login.prototype.setUserProfileBoolean = function () {
  console.log("setUserProfileBoolean");
  if (university !== "NOT_SET") {
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
