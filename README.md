# PastPaperHub

PastPaperHub (PPHub) is a place where students can find past papers and suggested answers. The past papers are hosted on Firebase while the answers are added by users via the Facebook comments plugin. Hosting is supported by Node and Expressjs.

The backend logic is written in JavaScript while the front end is basic HTML, CSS and some Jquery.

## Setting up the environment

Follow guidelines on how to set up Firebase here: https://firebase.google.com/docs/cli/
After installing the Firebase CLI; Clone the code, make a few changes, then run `firebase use staging` to use the test env.
If you can't see the project in your firebase project list, contact the admin to add your account.

Run `firebase serve` in the project's root folder to start up the server locally. (you may need sudo if you're on linux)

Since this is shared testing and stating environment, do not make deletions from the Firebase database unless you have permission to do so.

## Deploying to prod

When new changes are added to master, they need to be deployed to prod. This is currently a manual process. To deploy
to prod, checkout master branch, then run `firebase deploy -P past-paper-hub-prod`. Note: only the admin user has access to
prod instance and can deploy.
