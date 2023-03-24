// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3mnq22QObzWr5xiAgF91MK5kyg97Aq8c",
  authDomain: "co-player-a0cb6.firebaseapp.com",
  projectId: "co-player-a0cb6",
  storageBucket: "co-player-a0cb6.appspot.com",
  messagingSenderId: "175671683693",
  appId: "1:175671683693:web:f252057a519586abe3ed64",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const firebaseDB = getFirestore(app);

export const addSong = async (songs) => {
  const { title, url } = songs;
  if (!title || !url) {
    alert("Can't Add Song");
    return;
  }

  await setDoc(doc(firebaseDB, "songs", title), {
    title,
    url,
  })
    .then(() => {
      alert("Added");
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong");
    });
};

export const getAllSongs = async () => {
  const querySnapshot = await getDocs(collection(firebaseDB, "songs"));
  let allSongs = [];
  querySnapshot.forEach((doc) => {
    allSongs.push(doc.data());
  });

  return allSongs;
};

import { getDatabase, ref, set } from "firebase/database";

export const updateActiveSong = (song) => {
  const db = getDatabase();
  set(ref(db, "active"), {
    ...song,
  });
};
