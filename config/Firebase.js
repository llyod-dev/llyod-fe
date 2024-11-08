// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqaFirhFZvaBaHjOT6Y4xXVytdJBqGoCo",
    authDomain: "lloyed-6af40.firebaseapp.com",
    databaseURL: "https://lloyed-6af40-default-rtdb.firebaseio.com",
    projectId: "lloyed-6af40",
    storageBucket: "lloyed-6af40.appspot.com",
    messagingSenderId: "328006878223",
    appId: "1:328006878223:web:0ecb8876f28ad07d3acf7a",
    measurementId: "G-WDHXVCYTDM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)