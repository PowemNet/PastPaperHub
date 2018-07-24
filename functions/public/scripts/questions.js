'use strict';

// Initializes PastPaperHub.
function PastPaperHub() {
  this.messageList = document.getElementById('messages');
  this.pastPaperList = document.getElementById("past-paper-list");
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.initFirebase();
}

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

const pastPaperDbRef = localStorage.getItem("pastPaperClickedDbRef");
var questionsDbRef = pastPaperDbRef + "/questions";
PastPaperHub.prototype.loadQuestions = function() {
  var setItem = function(snap) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      var data = snap.val();

      a.textContent = data.text;
      a.setAttribute('href', "/question");
      li.appendChild(a);
      li.onclick = function(){
        var questionClickedDbRef = questionsDbRef + snap.key;
        localStorage.setItem("questionClickedDbRef", questionClickedDbRef);
        console.log("questionClickedDbRef-" + questionClickedDbRef);
      }
      this.pastPaperList.appendChild(li);
  }.bind(this)

  this.database.ref(questionsDbRef).limitToLast(12).on('child_added', setItem);
  this.database.ref(questionsDbRef).limitToLast(12).on('child_changed', setItem);
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
  this.loadQuestions();
};

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
