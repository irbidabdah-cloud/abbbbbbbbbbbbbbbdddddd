import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Post, SupportTicket, checkIsAuthorized } from '../types';
import { INITIAL_POSTS } from '../data/initialPosts';

export const firebaseConfig = {
  apiKey: "AIzaSyBwhnkQQlrz1nzBozBrSOU7w5dRYSaa7kA",
  authDomain: "faceprompt.firebaseapp.com",
  databaseURL: "https://faceprompt-default-rtdb.firebaseio.com",
  projectId: "faceprompt",
  storageBucket: "faceprompt.firebasestorage.app",
  messagingSenderId: "22919573634",
  appId: "1:22919573634:web:283fecd12637965e4d849b",
  measurementId: "G-6CC9HMZJGY",
};

// Initialize Firebase safely (singleton)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const POSTS_COLLECTION = 'faceprompt_posts';
const TICKETS_COLLECTION = 'faceprompt_support_tickets';

/**
 * Upload an image file directly to Firebase Cloud Storage.
 * Falls back gracefully to base64 DataURL if storage upload is unavailable.
 */
export async function uploadImageToStorage(file: File, folder = 'posts'): Promise<string> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${timestamp}_${cleanFileName}`;
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload failed, falling back to DataURL:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Realtime subscription to posts collection in Firestore.
 * Automatically seeds with INITIAL_POSTS if the cloud collection is empty.
 */
export function subscribeToPosts(
  onSuccess: (posts: Post[]) => void,
  onError?: (error: Error) => void
) {
  const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    postsQuery,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial posts to Firestore once so the cloud database has data
        try {
          for (const post of INITIAL_POSTS) {
            await setDoc(doc(db, POSTS_COLLECTION, post.id), post);
          }
        } catch (seedErr) {
          console.warn('Could not auto-seed Firestore posts:', seedErr);
        }
        onSuccess(INITIAL_POSTS);
      } else {
        const cloudPosts: Post[] = [];
        snapshot.forEach((docSnap) => {
          cloudPosts.push(docSnap.data() as Post);
        });
        onSuccess(cloudPosts);
      }
    },
    (error) => {
      console.warn('Firestore onSnapshot error (using fallback):', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Add or update a post in Firestore
 */
export async function savePostToFirestore(post: Post): Promise<void> {
  const postDocRef = doc(db, POSTS_COLLECTION, post.id);
  await setDoc(postDocRef, post, { merge: true });
}

/**
 * Delete a post from Firestore
 */
export async function deletePostFromFirestore(postId: string): Promise<void> {
  const postDocRef = doc(db, POSTS_COLLECTION, postId);
  await deleteDoc(postDocRef);
}

/**
 * Sign in with Google via Firebase Auth popup
 */
export async function loginWithGooglePopup(): Promise<{
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAuthorized: boolean;
}> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const email = user.email || null;
  return {
    email,
    displayName: user.displayName || 'مستخدم',
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${email || 'user'}`,
    isAuthorized: checkIsAuthorized(email),
  };
}

/**
 * Sign out from Firebase Auth
 */
export async function logoutFromFirebase(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Listen to Firebase Auth state changes
 */
export function onAuthChange(
  callback: (user: {
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAuthorized: boolean;
  } | null) => void
) {
  return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const email = fbUser.email || null;
      callback({
        email,
        displayName: fbUser.displayName || 'مستخدم',
        photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${email || 'user'}`,
        isAuthorized: checkIsAuthorized(email),
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Real-time subscription to Support Tickets in Firestore
 */
export function subscribeToTickets(
  onSuccess: (tickets: SupportTicket[]) => void,
  onError?: (error: Error) => void
) {
  const ticketsQuery = query(collection(db, TICKETS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    ticketsQuery,
    (snapshot) => {
      const tickets: SupportTicket[] = [];
      snapshot.forEach((docSnap) => {
        tickets.push(docSnap.data() as SupportTicket);
      });
      onSuccess(tickets);
    },
    (err) => {
      console.warn('Firestore tickets subscription error (falling back to local):', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a support ticket in Firestore
 */
export async function saveTicketToFirestore(ticket: SupportTicket): Promise<void> {
  try {
    const docRef = doc(db, TICKETS_COLLECTION, ticket.id);
    await setDoc(docRef, ticket, { merge: true });
  } catch (err) {
    console.warn('Error saving ticket to Firestore:', err);
  }
}

/**
 * Delete a support ticket from Firestore
 */
export async function deleteTicketFromFirestore(ticketId: string): Promise<void> {
  try {
    const docRef = doc(db, TICKETS_COLLECTION, ticketId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting ticket from Firestore:', err);
  }
}

