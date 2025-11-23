
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getConversationId } from "./getConversationId";


export function listenMessages(myUid, partnerUid, cb) {
  if (!myUid || !partnerUid) {
    console.warn("listenMessages: missing UIDs");
    return () => {};
  }

  const convId = getConversationId(myUid, partnerUid);

  const q = query(
    collection(db, "conversations", convId, "messages"),
    orderBy("createdAt", "asc")
  );

  
  const unsub = onSnapshot(
    q,
    (snap) => {
      try {
        const msgs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        cb(msgs);
      } catch (err) {
        console.error(" listenMessages map error:", err);
      }
    },
    (err) => {
      console.error(" listenMessages listener error:", err);
    }
  );

  return unsub; // cleanup
}
