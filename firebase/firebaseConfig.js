// firebase/firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkp5J4L1j11q4jQ-3IrxVXIANfLj5k32s",
  authDomain: "learn-firebase-auth-20cdb.firebaseapp.com",
  projectId: "learn-firebase-auth-20cdb",
  storageBucket: "learn-firebase-auth-20cdb.appspot.com",
  messagingSenderId: "401276893220",
  appId: "1:401276893220:web:eff48c4b7feebbfa8c80b1",
};

// Initialize Firebase App
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firestore instance
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage for persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  if (e.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw e;
  }
}

export { auth };

// Admin email and password
const adminEmail = "admin@gmail.com";
const adminPassword = "123456";
const adminUserId = "admin";

// Create admin account if it doesn't exist
const createAdminAccount = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log("Tài khoản admin đã được tạo thành công.");

    // Add admin details to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: adminEmail,
      isAdmin: true,
    });

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Tài khoản admin đã tồn tại trong Authentication.");
    } else {
      console.error("Đã xảy ra lỗi khi tạo tài khoản admin:", error);
    }
  }
};

// Check and create admin account when app starts
const checkAndCreateAdmin = async () => {
  const adminDoc = await getDoc(doc(db, 'users', adminUserId));
  if (!adminDoc.exists()) {
    await createAdminAccount();
  } else {
    console.log("Tài khoản admin đã tồn tại trong Firestore.");
  }
};

// Check and create admin on app startup
checkAndCreateAdmin();
