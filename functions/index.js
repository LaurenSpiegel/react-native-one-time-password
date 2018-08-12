// admin gives us access to service client
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// request and response modeled directly after exprss request and response objects
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello Oaf from Firebase!");
});

exports.createUser = functions.https.onRequest(createUser);