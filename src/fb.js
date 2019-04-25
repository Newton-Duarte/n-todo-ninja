import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDBieOEKYsFE6dZAqK7PlmvWFZeTgCIU8E",
  authDomain: "n-todo-ninja.firebaseapp.com",
  databaseURL: "https://n-todo-ninja.firebaseio.com",
  projectId: "n-todo-ninja",
  storageBucket: "n-todo-ninja.appspot.com",
  messagingSenderId: "827768356912"
};
firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();

export default db;
export { auth, functions };