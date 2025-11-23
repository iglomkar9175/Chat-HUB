
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export async function sendRequest(fromUid, toUid) {
  if (fromUid === toUid) return false;

  try {
    const fromRef = doc(db, "users", fromUid);
    const toRef = doc(db, "users", toUid);

    const fromSnap = await getDoc(fromRef);
    const toSnap = await getDoc(toRef);

    if (!fromSnap.exists() || !toSnap.exists()) return false;

    const me = fromSnap.data();
    const target = toSnap.data();

    
    if (me.friends?.includes(toUid)) return false;

    
    if (me.requests_sent?.includes(toUid)) return false;

    
    if (me.requests_received?.includes(toUid)) return false;

    
    await updateDoc(fromRef, {
      requests_sent: arrayUnion(toUid),
    });

    await updateDoc(toRef, {
      requests_received: arrayUnion(fromUid),
    });

    return true;
  } catch (err) {
    console.error("sendRequest error:", err);
    return false;
  }
}
