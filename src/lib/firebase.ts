import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "scorescribe-h0jaw",
  "appId": "1:175870411194:web:8f66a5b117e11d69545d83",
  "storageBucket": "scorescribe-h0jaw.firebasestorage.app",
  "apiKey": "AIzaSyCq8YRMd6eFGGxfpsQxb3OT7mK6Wa1SH3k",
  "authDomain": "scorescribe-h0jaw.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "175870411194"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
