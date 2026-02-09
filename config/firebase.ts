import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
     apiKey: "AIzaSyAccKZroZsp9lowzLnoJmaad7n7SAbnDTc",
     authDomain: "buddypay-28.firebaseapp.com",
     projectId: "buddypay-28",
     storageBucket: "buddypay-28.firebasestorage.app",
     messagingSenderId: "662927423861",
     appId: "1:662927423861:web:10a74edb9f4d4e481d3b3c",
     measurementId: "G-CX189LR6JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics safely
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;
