const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyAOmSfiNZ2QkLBEzGFnPIMBlZGDKDhpL1E",
  authDomain: "smartlightsystem-b70b1.firebaseapp.com",
  databaseURL: "https://smartlightsystem-b70b1.firebaseio.com",
  projectId: "smartlightsystem-b70b1",
  storageBucket: "smartlightsystem-b70b1.appspot.com",
  messagingSenderId: "556911981528",
  appId: "1:556911981528:web:4bc9304e8660dfc5ef78ad",
  measurementId: "G-7LQM13HZVS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.firestore().settings({});

module.exports = firebase;