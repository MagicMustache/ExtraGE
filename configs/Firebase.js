import * as firebase from "firebase";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDH3MPLsA61BxMpdU3iiVsNV7Ejiu51Di0",
    authDomain: "extrage-d2912.firebaseapp.com",
    databaseURL: "https://extrage-d2912.firebaseio.com",
    projectId: "extrage-d2912",
    storageBucket: "extrage-d2912.appspot.com",
    messagingSenderId: "1010705713117",
    appId: "1:1010705713117:web:df41b9c64e421b6bd31834",
    measurementId: "G-7ETX0568E7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
