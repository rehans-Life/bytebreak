import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URI,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
