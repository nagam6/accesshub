import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBYSAQZ8LHU-mhSgpUZySr2ZU7BLDxinTU',
  authDomain: 'accesshub-c7699.firebaseapp.com',
  projectId: 'accesshub-c7699',
  storageBucket: 'accesshub-c7699.firebasestorage.app',
  messagingSenderId: '592604993735',
  appId: '1:592604993735:web:58333c7fc1dee4881746e2',
  measurementId: 'G-Z2IIDYCETX',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app