// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwvUmsX4dNlugO0BSs4lOGAPzY9XbfeBU",
  authDomain: "dsp-emm-solution.firebaseapp.com",
  projectId: "dsp-emm-solution",
  storageBucket: "dsp-emm-solution.appspot.com",
  messagingSenderId: "116094334910",
  appId: "1:116094334910:web:fe9c922535d7b482986bef",
  measurementId: "G-ST2BEKC4PJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;