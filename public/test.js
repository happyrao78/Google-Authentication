import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbfZxTyQjmdimmDO1o4r2rt4jSduPyDdM",
  authDomain: "functions-59856.firebaseapp.com",
  projectId: "functions-59856",
  storageBucket: "functions-59856.appspot.com",
  messagingSenderId: "1071724301580",
  appId: "1:1071724301580:web:f507c0640f4f8c711c8d29",
  measurementId: "G-24W1TL8FR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

console.log(auth, app, analytics, db);

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDetails = document.getElementById('userDetails');

const provider = new GoogleAuthProvider();

signInBtn.onclick = () => signInWithPopup(auth, provider)
  .then((result) => {
    // User is signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${result.user.displayName}</h3>`;
  })
  .catch((error) => {
    console.log(error);
  });

signOutBtn.onclick = () => signOut(auth)
  .then(() => {
    // User is signed out
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = '';
  })
  .catch((error) => {
    console.log(error);
  });

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;

auth.onAuthStateChanged(user => {
  if (user) {
    thingsRef = collection(db, 'things');
    createThing.onclick = async () => {
      const name = prompt("Enter your name:");
      if (name) {
        try {
          await addDoc(thingsRef, {
            uid: user.uid,
            name: name,
            createdAt: serverTimestamp()
          });
          console.log('Document successfully written!');
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      }
    };
  }
});
