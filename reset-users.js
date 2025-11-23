

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "xxx",
  appId: "xxx",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetUsers() {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  console.log(`found ${snap.size} users — resetting…`);

  for (const user of snap.docs) {
    const data = user.data();

    const clean = (arr) =>
      Array.isArray(arr) ? arr : [];


    const patch = {
      friends: clean(data.friends),
      requests_sent: clean(data.requests_sent),
      requests_received: clean(data.requests_received),
    };

    console.log("reset:", user.id, patch);

    await updateDoc(doc(db, "users", user.id), patch);
  }

  console.log("🔥 all users cleaned successfully");
}

resetUsers().catch((err) => console.error(err));
