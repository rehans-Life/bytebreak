import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  storageBucket: process.env.FIREBASE_STORAGE_URI,
}

const app = initializeApp(firebaseConfig)
export default getStorage(app)
