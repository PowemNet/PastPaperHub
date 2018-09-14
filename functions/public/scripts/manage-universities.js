'use strict';
function ManageUniversities() {
  // Shortcuts to DOM Elements.
  this.saveButton = document.getElementById('save-university');
  this.universityInput = document.getElementById('university');
  this.universityList = document.getElementById("university-list");
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.saveButton.addEventListener('click', this.onSaveButtonClickedSubmit.bind(this));

  this.initFirebaseAndSetUpData();
}

var user;
var course;
var university;
var year;

ManageUniversities.prototype.initFirebaseAndSetUpData = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

ManageUniversities.prototype.authStateObserver = async function (userObject) {
  if (userObject) {
    user = userObject; //set user global object
    console.log(user);
    await this.fetchUniversities();
    await this.initUI();
  } else {
    this.showLoginScreen();
  }
};

ManageUniversities.prototype.fetchUniversities = function () {  //todo edit this function to fetch universities not user
  return new Promise((resolve, reject) => {

    var setUiItem = function(snap) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      var data = snap.val();

      a.textContent = data.name;
      // a.setAttribute('href', "/questions");
      // li.appendChild(a);
      // li.onclick = function(){
      //   var pastPaperClickedDbRef = hardCodedPastPaperDbRef + snap.key;
      //   localStorage.setItem("pastPaperClickedDbRef", pastPaperClickedDbRef);
      //   localStorage.setItem("pastPaperClickedText", data.title);
      // }
      this.universityList.appendChild(li);
      // this.pleaseWaitText.style.visibility = "hidden";
  }.bind(this)

  this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_added', setUiItem);  //todo get correct fet here: friday evenign with June
  this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_changed', setUiItem);
  });
};

ManageUniversities.prototype.initUI = function () {  //set up the list of universities
  return new Promise((resolve, reject) => {
    // this.selectElement("course", course);
    // this.selectElement("university", university);
    // this.selectElement("year", year);
    resolve();
  });

};

ManageUniversities.prototype.selectElement = function (id, valueToSelect) {
  var element = document.getElementById(id);
  element.value = valueToSelect;
}

const dbRef = firebase.database().ref();

ManageUniversities.prototype.saveUniversity = function (university) {
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
      await this.fetchUniversities();
      await this.initUI();
      var data = {
        message: 'University saved!',
        timeout: 2000
      };
    }
  });
};

ManageUniversities.prototype.onSaveButtonClickedSubmit = function (e) {
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
ManageUniversities.prototype.checkSignedIn = function () {
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
  window.ManageUniversities = new ManageUniversities();
});
