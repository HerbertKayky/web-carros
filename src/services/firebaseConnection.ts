import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHOfFJn6r2NWzkdQCfS_IPAKWTwMEBKPY",
  authDomain: "webcarros-dd135.firebaseapp.com",
  projectId: "webcarros-dd135",
  storageBucket: "webcarros-dd135.appspot.com",
  messagingSenderId: "474031048967",
  appId: "1:474031048967:web:7848e363ac5b7f31811da2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
