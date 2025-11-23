
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function createUserIfMissing(user) {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      username: user.email.split("@")[0],
      email: user.email,
      photoURL: user.photoURL || "",
      bio: "I'm using ChatHub 💬",
      createdAt: new Date(),
      friends: [],
      requests_received: [],
      requests_sent: []
    });
    return;
  }

  
  const u = snap.data();
  const repaired = {
    friends: Array.isArray(u.friends) ? u.friends : [],
    requests_received: Array.isArray(u.requests_received) ? u.requests_received : [],
    requests_sent: Array.isArray(u.requests_sent) ? u.requests_sent : []
  };

  await setDoc(ref, { ...u, ...repaired }, { merge: true });
}
