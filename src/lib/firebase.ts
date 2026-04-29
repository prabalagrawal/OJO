import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection strictly
async function testConnection(retries = 3) {
  try {
    // Attempting a server-side read as described in guidelines
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified.");
  } catch (error) {
    if (retries > 0) {
      console.warn(`Connection attempt failed, retrying... (${retries} left)`);
      setTimeout(() => testConnection(retries - 1), 2000);
      return;
    }
    
    if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore'))) {
      console.error("Please check your Firebase configuration. The client is reporting offline or unreachable.");
    } else {
      // It might just be 'permission-denied' if the doc doesn't exist AND rules block it, 
      // but 'test/connection' allowed for public read so this is unlikely.
      console.log("Firebase connection test performed (it might be empty or restricted, but reachable).");
    }
  }
}
testConnection();
