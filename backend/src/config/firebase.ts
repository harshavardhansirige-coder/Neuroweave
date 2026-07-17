import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let appInitialized = false;

export const initializeFirebase = () => {
  if (appInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  try {
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId
      });
      console.log('>>> [Firebase Admin] Initialized with Service Account JSON.');
      appInitialized = true;
    } else if (projectId) {
      admin.initializeApp({
        projectId: projectId
      });
      console.log('>>> [Firebase Admin] Initialized with Project ID.');
      appInitialized = true;
    } else {
      console.warn('>>> [Firebase Admin] No FIREBASE_PROJECT_ID found. Initializing in sandbox mode.');
    }
  } catch (error) {
    console.error('>>> [Firebase Admin] Initialization failed:', error);
  }
};

export const verifyFirebaseToken = async (idToken: string) => {
  if (!appInitialized) {
    // If not initialized, return sandbox/mock authentication in dev environment
    console.warn('>>> [Firebase Admin Sandbox] Returning mock user session (Admin not initialized).');
    if (idToken === 'mock-jwt-token') {
      return {
        uid: 'mock-firebase-uid-123',
        email: 'sandbox.user@learnforge.ai',
        name: 'Sandbox Student'
      };
    }
    throw new Error('Firebase Admin not initialized. Use mock-jwt-token for sandbox verification.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('>>> [Firebase Admin] Token verification failed:', error);
    throw error;
  }
};
