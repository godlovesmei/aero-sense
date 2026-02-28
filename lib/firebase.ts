// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // <-- TAMBAHKAN INI
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLY2t8iAVK8P6ehseP02NbjWkkHXfvywA",
  authDomain: "aero-sense-21921.firebaseapp.com",
  databaseURL:
    "https://aero-sense-21921-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aero-sense-21921",
  storageBucket: "aero-sense-21921.firebasestorage.app",
  messagingSenderId: "531339053412",
  appId: "1:531339053412:web:c9c872c1d017b7aba41271",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // <-- TAMBAHKAN INI

export { database }; // <-- TAMBAHKAN INI
