import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import { firebaseConfig } from '../firebase/config.js'
// copia en /services/config.js el fichero .json con la configuración de firebase
// similar al ejemplo /services/config.js.example

const useEmulator = true //false//import.meta.env.DEV || false

let app
let auth
let db

export function initApp() {
  if (!app) {
    console.log('Inicializando firebase')
    app = initializeApp(firebaseConfig)
    if (useEmulator) {
      console.log('Conectando a emulador de funciones')
      const functions = getFunctions(app);
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }
  }
  return app
}

function doInitAuth() {
  // Initialize Firebase
  if (!auth) {
    auth = getAuth(initApp())
    if (useEmulator) {
      console.log('Conectando a emulador de autenticación')
      connectAuthEmulator(auth, 'http://localhost:9099')
    }
  }
  return auth
}

export function setAuthCallback(userCallback) {
  if (userCallback) {
    auth = doInitAuth()
    onAuthStateChanged(auth, userCallback)
  }
  return auth
}

function getCurrentUserPromise(auth) {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })
}

export const getCurrentUser = async () => {
  const auth = doInitAuth()
  if (auth.currentUser) return auth.currentUser
  return await getCurrentUserPromise(auth)
}

export async function createUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    doInitAuth(),
    email,
    password,
  )
  return userCredential ? userCredential.user : null
}

export async function logIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    doInitAuth(),
    email,
    password,
  )
  return userCredential ? userCredential.user : null
}

export async function logInWithGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    const auth = doInitAuth()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    /*const db = getDB()
    const usersRef = collection(db, 'users')

    const userIdQuery = query(usersRef, where('userId', '==', user.uid))
    const userEmailQuery = query(usersRef, where('userEmail', '==', user.email))

    const userIdSnapshot = await getDocs(userIdQuery)
    const userEmailSnapshot = await getDocs(userEmailQuery)

    if (userIdSnapshot.empty && userEmailSnapshot.empty) {
      const newUser = {
        userId: user.uid,
        userUsername: user.displayName,
        userEmail: user.email,
        pendingGames: []
      }
      // await addDoc(usersRef, newUser)
      await setDoc(doc(usersRef, user.uid), newUser)
    }*/
    return user
  } catch (error) {
    console.error('Error signing in with Google', error)
    return null
  }
}

export async function logOut() {
  await signOut(doInitAuth())
}

export async function emailReset(email) {
  await sendPasswordResetEmail(doInitAuth(), email)
}

export async function emailVerification() {
  const auth = doInitAuth()
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser)
    return true
  } else {
    throw new Error('User not logged, can not send verification email')
  }
}

export function getDB() {
  if (!db) {
    db = getFirestore(initApp())
    if (useEmulator) {
      console.log('Conectando a emulador de firestore')
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    }
  }
  return db
}

export function getCalls() {
  return getFunctions(initApp())
}