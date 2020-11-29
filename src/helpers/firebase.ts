import firebase from "firebase/app";
import "firebase/auth";
import { FIREBASE_CONFIG } from "./firebaseConfig";

firebase.initializeApp(FIREBASE_CONFIG);

const auth = firebase.auth();
export default auth;
export const authenticateGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};

export const isAuth = () => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user || null);
    });
  });
};
