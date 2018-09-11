'use strict';

// Initializes PastPaperHub.
function PastPaperHub() {
  this.messageList = document.getElementById('messages');
  this.pleaseWaitText = document.getElementById("please-wait-text");
  this.pastPaperList = document.getElementById("past-paper-list");
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  
  this.profileForm = document.getElementById('profile-form');
  this.yearInput = document.getElementById('year');
  this.courseInput = document.getElementById('course');
  this.universityInput = document.getElementById('university');
  this.initFirebase();
}

var user;
var year;
var course;
var university;

// Sets up shortcuts to Firebase features and initiate firebase auth.
PastPaperHub.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.messaging = firebase.messaging();

  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.authStateObserver.bind(this));
};

// Signs-out of Friendly Chat.
PastPaperHub.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Returns the signed-in user's profile Pic URL.
PastPaperHub.prototype.getProfilePicUrl = function() {
  return this.auth.currentUser.photoURL || 'images/profile_placeholder.png'; //todo check why this doesnt work
}

// Returns the signed-in user's display name.
PastPaperHub.prototype.getUserName = function() {
  return this.auth.currentUser.displayName;
}

// Returns true if a user is signed-in.
PastPaperHub.prototype.isUserSignedIn = function() {
  return !!this.auth.currentUser;
}

var hardCodedPastPaperDbRef = '/pastpapers/university/makerere/comp_eng/year_1/electronics/';
// Loads pastpapers and listens for upcoming ones.
PastPaperHub.prototype.loadPastPapers = function() {
  var setItem = function(snap) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      var data = snap.val();

      a.textContent = data.title;
      a.setAttribute('href', "/questions");
      li.appendChild(a);
      li.onclick = function(){
        var pastPaperClickedDbRef = hardCodedPastPaperDbRef + snap.key;
        localStorage.setItem("pastPaperClickedText", data.title);
      }
      this.pastPaperList.appendChild(li);
      this.pleaseWaitText.style.visibility = "hidden";
  }.bind(this)

  this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_added', setItem);
  this.database.ref(hardCodedPastPaperDbRef).limitToLast(12).on('child_changed', setItem);
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
PastPaperHub.prototype.authStateObserver = function(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = this.getProfilePicUrl();
    var userName = this.getUserName();

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    
  } else { // User is signed out!
    window.location.href = "/login";
  }
  // Load existing past papers.
  this.loadPastPapers();
};

PastPaperHub.prototype.authStateObserver = async function (userObject) {
  if (userObject) {
    user = userObject; //set user global object
    console.log(user);
    await this.fetchUserMetadata();
    await this.initUI();
    // this.saveMessagingDeviceToken();
  } else { 
    this.showLoginScreen();
  }
};

PastPaperHub.prototype.fetchUserMetadata = function () {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
      if(snapshot){
        course = (snapshot.val() && snapshot.val().course) || 'NOT_SET';
        university = (snapshot.val() && snapshot.val().university) || 'NOT_SET';
        year = (snapshot.val() && snapshot.val().year) || 'NOT_SET';
        resolve();
        return snapshot;
      }
      else{
        throw new Error("error getUniversityFromDb" );
      }
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log("error getUniversityFromDb:" + errorMessage);
    });
  });
};

PastPaperHub.prototype.initUI = function () {
  return new Promise((resolve, reject) => {
    this.selectElement("course", course);
    this.selectElement("university", university);
    this.selectElement("year", year);
    resolve();
  });

};

PastPaperHub.prototype.selectElement = function (id, valueToSelect)
{    
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

// Returns true if user is signed-in. Otherwise false and displays a message.
PastPaperHub.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Resets the given MaterialTextField.
PastPaperHub.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// A loading image URL.
PastPaperHub.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Enables or disables the submit button depending on the values of the input
// fields.
PastPaperHub.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

window.addEventListener('load' , function() {
  window.PastPaperHub = new PastPaperHub();
});
