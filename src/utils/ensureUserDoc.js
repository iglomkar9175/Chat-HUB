import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const ensureUserDoc = async (uid, email) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      email,
      username: email.split("@")[0],
      name: email.split("@")[0],
      photoURL: "/pfp1.png",
      bio: "I'm using ChatHub 💬",
      friends: [],
      requests_sent: [],
      requests_received: [],
      createdAt: new Date(),
    });
    return true;
  }

  const d = snap.data();
  let updated = false;

  const normalize = (k) => {
    if (!Array.isArray(d[k])) {
      d[k] = [];
      updated = true;
    }
  };

  normalize("friends");
  normalize("requests_sent");
  normalize("requests_received");

  if (updated) await setDoc(ref, d, { merge: true });

  return true;
};
