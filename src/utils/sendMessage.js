import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getConversationId } from "./getConversationId";

export async function sendMessage(from, to, text, type = "text") {
  const convId = getConversationId(from, to);
  const msgId = crypto.randomUUID();

  await setDoc(
    doc(db, "conversations", convId, "messages", msgId),
    {
      id: msgId,
      from,
      to,
      text,
      type,           
      createdAt: serverTimestamp(),
    }
  );

  return true;
}
