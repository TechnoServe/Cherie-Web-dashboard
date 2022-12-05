// import {firebase} from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import "firebase/database";
// let config = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: "grownative-bd3eb.firebaseapp.com",
//   databaseURL: "https://grownative-bd3eb.firebaseio.com",
//   projectId: "grownative-bd3eb",
//   storageBucket: "grownative-bd3eb.appspot.com",
//   messagingSenderId: "967554532601",
//   appId: "1:967554532601:web:b93916a766e534cb",
// };

// TNS
const config = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "cherie-323217.firebaseapp.com",
  databaseURL: "https://cherie-323217-default-rtdb.firebaseio.com",
  projectId: "cherie-323217",
  storageBucket: "cherie-323217.appspot.com",
  messagingSenderId: "610396315391",
  appId: "1:610396315391:web:8e99805e545dc3784c76ca",
  measurementId: "G-PCXC7N9KKQ"
};
  
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

  
// export auth;
export {db, auth};