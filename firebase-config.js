// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIezcVt71YoSQvLQlkKSZMfHqCrF4pU-A",
  authDomain: "multipurpose-app-ad74e.firebaseapp.com",
  databaseURL: "https://multipurpose-app-ad74e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "multipurpose-app-ad74e",
  storageBucket: "multipurpose-app-ad74e.firebasestorage.app",
  messagingSenderId: "985603022972",
  appId: "1:985603022972:web:d4299c609f70c2386129f9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);