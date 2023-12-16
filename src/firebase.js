import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import env from './apikey';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
   
  };

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
