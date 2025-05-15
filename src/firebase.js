
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATIPDdUsSGEZI1tAItyEjOXh6GgZStbX8",
  authDomain: "sarooom-4e732.firebaseapp.com",
  projectId: "sarooom-4e732",
  storageBucket: "sarooom-4e732.firebasestorage.app",
  messagingSenderId: "367375525181",
  appId: "1:367375525181:web:6ca5ece64cfd39a11e9154",
  measurementId: "G-JXTQGCJYJR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut, doc, getDoc, setDoc };
