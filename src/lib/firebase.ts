import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi asli dari proyek Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCYv9OUSoAxkGySphKlsu2fi09ZM8fIA78",
  authDomain: "reservasi-b1bd8.firebaseapp.com",
  projectId: "reservasi-b1bd8",
  storageBucket: "reservasi-b1bd8.firebasestorage.app",
  messagingSenderId: "160348201455",
  appId: "1:160348201455:web:4fa45fb281c4e1c9d9961a",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan Firebase agar bisa digunakan di komponen React
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
