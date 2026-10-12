"use strict";

const firebaseConfig = {
  apiKey: "AIzaSyAyJ8RCiKcsrSDylCYiBuWCoGxQnvWW4ug",
  authDomain: "game-zone-io.firebaseapp.com",
  projectId: "game-zone-io",
  storageBucket: "game-zone-io.firebasestorage.app",
  messagingSenderId: "90474205507",
  appId: "1:90474205507:web:0af6fb7367e6dd332a1ff6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.gzFirebaseAuth = firebase.auth();
window.gzFirebaseDb = firebase.firestore();
