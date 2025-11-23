
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


export async function searchUser(username) {
  try {
    if (!username || username.trim() === "") {
      return null;
    }

    const clean = username.trim().toLowerCase();

    const q = query(
      collection(db, "users"),
      where("username", "==", clean)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const docRef = snap.docs[0];
    const data = docRef.data() || {};

    return {
      uid: data.uid || docRef.id,
      username: data.username || "",
      name: data.name || data.username || "",
      photoURL: data.photoURL || "/pfp1.png",
    };
  } catch (e) {
    console.error(" searchUser error:", e);
    return null;
  }
}
