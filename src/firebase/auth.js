// Authentication service. All calls go through Firebase Authentication —
// no passwords are ever stored manually in Firestore.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Register a new customer account.
 * Creates the Firebase Auth user, then creates the matching `users/{uid}`
 * profile document in Firestore with role "customer".
 */
export async function registerCustomer({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    phone: '',
    role: 'customer',
    description: '', // personal note, unrelated to delivery
    delivery: {
      fullName: '',
      phone: '',
      city: '',
      address: '',
      googleMapsUrl: '',
      deliveryNote: '',
    },
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/** Fetch the Firestore profile (role, delivery info, etc.) for a signed-in user. */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/** Subscribe to Firebase auth state changes. Returns the unsubscribe function. */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}
