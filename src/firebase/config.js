import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyB5hKE0eEJRxdNCybIzQyGUBnv8zxu3qYc",
    authDomain: "nadeem-interprises.firebaseapp.com",
    projectId: "nadeem-interprises",
    storageBucket: "nadeem-interprises.firebasestorage.app",
    messagingSenderId: "545210954115",
    appId: "1:545210954115:web:918cc6c37808e8d21b46b6"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
