import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth ,signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAK87hTRWCCav6sDZQB-1jP2FUGKaOnUcE",
  authDomain: "bytes-mern.firebaseapp.com",
  projectId: "bytes-mern",
  storageBucket: "bytes-mern.appspot.com",
  messagingSenderId: "916863360881",
  appId: "1:916863360881:web:3b6c6cc3f07023dac2e0d0"
};

const app = initializeApp(firebaseConfig);

// Google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user
    })
    .catch((err) => {
      console.log(err);
    })

  return user;
}

