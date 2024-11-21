// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAz9cA-PffPZLgKuQLxWCi8F6yu_tNbKgg",
    authDomain: "surge-drum.firebaseapp.com",
    projectId: "surge-drum",
    storageBucket: "surge-drum.firebasestorage.app",
    messagingSenderId: "855960177617",
    appId: "1:855960177617:web:dbeb07a90bccbf632b2ef0",
    measurementId: "G-QRRZCMVRCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db }
