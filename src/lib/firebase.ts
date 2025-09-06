// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxCA1F7zbWC9MEc9q3Dfzq2-2HKXhdTBg",
  authDomain: "events-calendar-1d1ed.firebaseapp.com",
  projectId: "events-calendar-1d1ed",
  storageBucket: "events-calendar-1d1ed.firebasestorage.app",
  messagingSenderId: "813936706029",
  appId: "1:813936706029:web:df91f554ad46fd5396a7e4",
  measurementId: "G-SHC1501TFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics (unused for now, but available for future use)
// const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
