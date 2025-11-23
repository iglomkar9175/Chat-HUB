
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export async function acceptRequest(myUid, fromUid) {
  try {
    
    await updateDoc(doc(db, "users", myUid), {
      requests_received: arrayRemove(fromUid),
      friends: arrayUnion(fromUid),
    });

    
    await updateDoc(doc(db, "users", fromUid), {
      requests_sent: arrayRemove(myUid),
      friends: arrayUnion(myUid),
    });

    return true;
  } catch (err) {
    console.error("acceptRequest error:", err);
    return false;
  }
}
