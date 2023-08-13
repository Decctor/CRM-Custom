// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: "sistemaampere.firebaseapp.com",
//   projectId: "sistemaampere",
//   storageBucket: "sistemaampere.appspot.com",
//   messagingSenderId: "496303969093",
//   appId: process.env.FIREBASE_APPID,
// };
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: "appcustom-d6fa1.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
