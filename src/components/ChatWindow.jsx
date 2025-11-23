import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { listenMessages } from "../utils/listenMessages";
import { sendMessage } from "../utils/sendMessage";
import { uploadChatMedia } from "../utils/uploadChatMedia";
import { auth } from "../firebase";
import { IoMenu } from "react-icons/io5";


export default function ChatWindow({ chatId, chatMeta, setMobileOpen }) {
  const user = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendingImg, setSendingImg] = useState(false);
  const bodyRef = useRef(null);

  
  useEffect(() => {
    if (!chatId || !user?.uid) return;

    const unsub = listenMessages(user.uid, chatId, (msgs) => {
      setMessages(msgs || []);
      
      setTimeout(() => {
        try {
          bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth",
          });
        } catch {
          // fallback
          if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
      }, 50);
    });

    return () => unsub && unsub();
  }, [chatId, user?.uid]);

  
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(user.uid, chatId, input.trim(), "text");
    setInput("");
   
    setTimeout(() => {
      try {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
      } catch {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, 80);
  };

  
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSendingImg(true);
    try {
      const imgUrl = await uploadChatMedia(file);
      await sendMessage(user.uid, chatId, imgUrl, "image");
      setTimeout(() => {
        try {
          bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
        } catch {
          if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
      }, 80);
    } catch (err) {
      console.error("image send error", err);
    } finally {
      setSendingImg(false);
    }
  };

  return (
   <div
  className="chathub-content"
  style={{
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0, 
  }}
>
      
      <div className="chat-header" style={{ display: "flex", alignItems: "center" }}>
        
        <div
          className="mobile-toggle"
          onClick={() => setMobileOpen(true)}
          style={{
            display: "none",
            marginRight: 12,
            fontSize: 26,
            cursor: "pointer",
            color: "white",
          }}
        >
          <IoMenu />
        </div>

        <img
          src={chatMeta?.avatar || "/default-avatar.png"}
          alt="avatar"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ marginLeft: 12 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{chatMeta?.name || "Unknown"}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Active now</div>
        </div>
      </div>

     
      <div ref={bodyRef} className="chat-body">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            me={m.from === user.uid}
            text={m.text}
            type={m.type}
            ts={
              m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString() : ""
            }
          />
        ))}
      </div>

      
      <div className="chat-input-bar">
        <input type="file" id="imgPicker" accept="image/*" hidden onChange={handleImageSelect} />

        <button
          onClick={() => document.getElementById("imgPicker").click()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
            fontSize: 22,
          }}
        >   
         📸
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>

      {sendingImg && (
        <div
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            padding: "8px 14px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.45)",
            color: "white",
          }}
        >
          Uploading…
        </div>
      )}
    </div>
  );
}
