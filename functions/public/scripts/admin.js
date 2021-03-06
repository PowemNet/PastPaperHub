'use strict';
function Admin() {
  // Shortcuts to DOM Elements.
  this.saveNewUniversityButton = document.getElementById('save-new-university');
  this.saveEditedUniversityButton = document.getElementById('save-edited-university-details');
  this.universityInput = document.getElementById('university');
  this.universityList = document.getElementById("university-list");
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.saveNewUniversityButton.addEventListener('click', this.onsaveNewUniversityButtonClicked.bind(this));
  this.saveEditedUniversityButton.addEventListener('click', this.onEditUniversityButtonClickedSubmit.bind(this));

  this.initFirebaseAndSetUpData();
}

var user;

var universityDbList = [];
const dbRef = firebase.database().ref();

Admin.prototype.initFirebaseAndSetUpData = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

Admin.prototype.authStateObserver = async function (userObject) {
  if (userObject) {
    user = userObject; //set user global object
    console.log(user);
    await this.fetchUniversities();
  } else {
    this.showLoginScreen();
  }
};

var universitiesDbRef = '/universities/';
Admin.prototype.fetchUniversities = function () {  //todo edit this function to fetch universities not user
  return new Promise((resolve, reject) => {

    var setUiItem = function(snap) {
      var li = document.createElement("li");
      var input = document.createElement("input");
      var data = snap.val();
      var listItem = [snap]
      universityDbList.push(listItem)
      input.value = data.name;
      li.appendChild(input);
      this.universityList.appendChild(li);
  }.bind(this)

  this.database.ref(universitiesDbRef).limitToLast(12).on('child_added', setUiItem);
  this.database.ref(universitiesDbRef).limitToLast(12).on('child_changed', setUiItem);
  });
};

Admin.prototype.selectElement = function (id, valueToSelect) {
  var element = document.getElementById(id);
  element.value = valueToSelect;
}

Admin.prototype.saveUniversity = async function (university) {
  var self = this;
  console.log("---------");
  console.log(university);
  return this.database.ref('/universities/').push({
    name : university
  }, async function (error) {
    if (error) {
      console.log("failed to save!");
    } else {
      console.log("successfully saved!");
      await this.fetchUniversities();
      var data = {
        message: 'University saved!',
        timeout: 2000
      };
    }
  });
};

Admin.prototype.onsaveNewUniversityButtonClicked = function (e) {
  e.preventDefault();
  if (this.checkSignedIn()) {
    this.saveUniversity(
      this.universityInput.value).then(function () {
      }.bind(this)).catch(function (error) {
        console.error('Error: ', error);
      });
  }
};

Admin.prototype.onEditUniversityButtonClickedSubmit = async function (e) {
  //append university list from firebase with new text
  //compare text from firebase with new appended text for each entry
  //submit to firebase for entries whose new appeneded text do not match

  e.preventDefault();
  if (this.checkSignedIn()) {
    await this.appendUniversityListWithNewEditedText();
    await this.compareText();
  }
};

Admin.prototype.appendUniversityListWithNewEditedText = function () {
  var listItems = this.universityList.getElementsByTagName("li");
  for (var i=0; i < listItems.length; i++) {
    universityDbList[i].splice(1, 0, listItems[i].getElementsByTagName("input")[0].value)  
  } 
};

Admin.prototype.compareText = function () {
  for (var i=0; i < universityDbList.length; i++) {
    if (universityDbList[i][0].val().name !== universityDbList[i][1]){
      this.updateUniversityInDb(universityDbList[i][0].key, universityDbList[i][1]);
    }
  }

  //reset local variables and update ui to show new data
  this.resetUniversityList()
  this.fetchUniversities()
};

Admin.prototype.updateUniversityInDb = function (dbKey, newText) {
  return this.database.ref('/universities/'+dbKey).update({
    name: newText
  }, function (error) {
    if (error) {
      console.log("failed to update");
    } else {
      console.log("Update successful!")
    }
  });
};

Admin.prototype.resetUniversityList = function () {
  //reset local list
  universityDbList.length = 0
  //reset HTML list
  while(universityList.firstChild) universityList.removeChild(universityList.firstChild);
};
// Returns true if user is signed-in. Otherwise false and displays a message.
Admin.prototype.checkSignedIn = function () {
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
  window.Admin = new Admin();
});
