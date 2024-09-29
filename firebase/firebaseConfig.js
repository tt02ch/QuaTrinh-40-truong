import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCkp5J4L1j11q4jQ-3IrxVXIANfLj5k32s",
    authDomain: "learn-firebase-auth-20cdb.firebaseapp.com",
    projectId: "learn-firebase-auth-20cdb",
    storageBucket: "learn-firebase-auth-20cdb.appspot.com",
    messagingSenderId: "401276893220",
    appId: "1:401276893220:web:eff48c4b7feebbfa8c80b1"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}

// Firestore instance
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) // Set persistence to AsyncStorage
});

// Tạo tài khoản admin nếu chưa tồn tại
const createAdminAccount = async () => {
    const adminEmail = "admin@example.com";
    const adminPassword = "123456";
    const adminUserId = "admin"; // ID của admin trong Firestore

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        
        // Thêm thông tin tài khoản admin vào Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
            email: adminEmail,
            isAdmin: true,
        });

        console.log("Tài khoản admin đã được tạo thành công.");
    } catch (error) {
        console.log("Tài khoản admin đã tồn tại hoặc xảy ra lỗi:", error);
    }
};

// Kiểm tra và tạo tài khoản admin khi ứng dụng khởi động
const checkAndCreateAdmin = async () => {
    const adminEmail = "admin@example.com";
    
    const userQuery = await getDoc(doc(db, 'users', 'admin'));
    if (!userQuery.exists()) {
        await createAdminAccount();
    }
};

checkAndCreateAdmin();

export { auth }; // Xuất auth
