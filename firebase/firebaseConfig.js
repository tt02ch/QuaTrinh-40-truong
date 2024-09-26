// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCkp5J4L1j11q4jQ-3IrxVXIANfLj5k32s",
    authDomain: "learn-firebase-auth-20cdb.firebaseapp.com",
    projectId: "learn-firebase-auth-20cdb",
    storageBucket: "learn-firebase-auth-20cdb.appspot.com",
    messagingSenderId: "401276893220",
    appId: "1:401276893220:web:eff48c4b7feebbfa8c80b1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
