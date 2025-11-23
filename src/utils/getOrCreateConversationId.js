import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


export async function getOrCreateConversationId(aUid, bUid) {
  
  const convCol = collection(db, "conversations");
  const q = query(convCol, where("users", "array-contains", aUid));
  const snap = await getDocs(q);

  
  for (const docSnap of snap.docs) {
    const d = docSnap.data();
    const users = d.users || [];
    if (users.includes(aUid) && users.includes(bUid)) {
      return docSnap.id;
    }
  }

  
  const newDocRef = await addDoc(collection(db, "conversations"), {
    users: [aUid, bUid],
    lastMessage: "",
    lastTimestamp: serverTimestamp()
  });

  return newDocRef.id;
}
