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

};

Login.prototype.signIn = function() {
  var provider = new firebase.auth.FacebookAuthProvider();
  this.auth.signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    window.location.href = "/";
  }).catch(function(error) {
    var errorMessage = error.message;
    console.log("error loggin in: "+errorMessage);
  });
};

window.addEventListener('load' , function() {
  window.Login = new Login();
});
