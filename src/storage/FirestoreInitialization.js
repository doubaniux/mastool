// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import firebaseCredentials from "./firebaseCredentials";

const firebaseApp = initializeApp({
    apiKey: firebaseCredentials.apiKey,
    authDomain: firebaseCredentials.authDomain,
    projectId: firebaseCredentials.projectId,
});

const db = getFirestore();

export default db;