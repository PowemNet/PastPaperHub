'use strict';
// Initializes FriendlyChat.
function Profile() {
  // Shortcuts to DOM Elements.
  this.saveButton = document.getElementById('save-university');
  this.universityInput = document.getElementById('university');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.saveButton.addEventListener('click', this.onSaveButtonClickedSubmit.bind(this));

  this.initFirebaseAndSetUpData();
}

var user;
var course;
var university;
var year;

Profile.prototype.initFirebaseAndSetUpData = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

Profile.prototype.authStateObserver = async function (userObject) {
  if (userObject) {
    user = userObject; //set user global object
    console.log(user);
    await this.fetchUniversities();
    await this.initUI();
  } else {
    this.showLoginScreen();
  }
};

Profile.prototype.fetchUniversities = function () {  //todo edit this function to fetch universities not user
  return new Promise((resolve, reject) => {
    // firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {  
    //   if (snapshot) {
    //     course = (snapshot.val() && snapshot.val().course) || 'NOT_SET';
    //     university = (snapshot.val() && snapshot.val().university) || 'NOT_SET';
    //     year = (snapshot.val() && snapshot.val().year) || 'NOT_SET';
    //     resolve();
    //     return snapshot;
    //   }
    //   else {
    //     throw new Error("error getUniversityFromDb");
    //   }
    // }).catch(function (error) {
    //   var errorMessage = error.message;
    //   console.log("error getUniversityFromDb:" + errorMessage);
    // });
  });
};

Profile.prototype.initUI = function () {  //set up the list of universities
  return new Promise((resolve, reject) => {
    // this.selectElement("course", course);
    // this.selectElement("university", university);
    // this.selectElement("year", year);
    resolve();
  });

};

Profile.prototype.selectElement = function (id, valueToSelect) {
  var element = document.getElementById(id);
  element.value = valueToSelect;
}

const dbRef = firebase.database().ref();

Profile.prototype.saveUniversity = function (university) {
  var self = this;
  console.log("---------");
  console.log(university);
  return this.database.ref('/universities/').push({
    name : university
  }, function (error) {
    if (error) {
      console.log("failed to save!");
    } else {
      console.log("successfully saved!");
      var data = {
        message: 'University saved!',
        timeout: 2000
      };
    }
  });
};

Profile.prototype.onSaveButtonClickedSubmit = function (e) {
  e.preventDefault();
  if (this.checkSignedIn()) {
    this.saveUniversity(
      this.universityInput.value).then(function () {
      }.bind(this)).catch(function (error) {
        console.error('Error: ', error);
      });
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
Profile.prototype.checkSignedIn = function () {
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

window.addEventListener('load', function () {
  window.Profile = new Profile();
});
