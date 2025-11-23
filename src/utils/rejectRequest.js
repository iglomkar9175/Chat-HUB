
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

export async function rejectRequest(myUid, fromUid) {
  try {
    await updateDoc(doc(db, "users", myUid), {
      requests_received: arrayRemove(fromUid),
    });

    await updateDoc(doc(db, "users", fromUid), {
      requests_sent: arrayRemove(myUid),
    });

    return true;
  } catch (err) {
    console.error("rejectRequest error:", err);
    return false;
  }
}
