import React, { useEffect, useState, useCallback } from "react";
import "../styles/chathub-glass.css";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Friends from "../components/Friends";
import Requests from "../components/Requests";
import Profile from "../components/Profile";

import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc
} from "firebase/firestore";

import { createUserIfMissing } from "../utils/createUserIfMissing";
import { sendRequest } from "../utils/sendRequest";
import { acceptRequest } from "../utils/acceptRequest";
import { rejectRequest } from "../utils/rejectRequest";
import { getConversationId } from "../utils/getConversationId";
import { onSnapshot } from "firebase/firestore";
import { searchUser } from "../utils/searchUser";

const TABS = {
  CHAT: "CHAT",
  FRIENDS: "FRIENDS",
  REQUESTS: "REQUESTS",
  PROFILE: "PROFILE"
};

export default function ChatHub() {
  const user = auth.currentUser;
  const uid = user?.uid;

  const [activeTab, setActiveTab] = useState(TABS.CHAT);
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);
  const [profile, setProfile] = useState(null);

  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMeta, setChatMeta] = useState(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), async (snap) => {
      if (!snap.exists()) return;

      const u = snap.data();
      setProfile({ uid, ...u });

      setRequestsReceived(u.requests_received || []);
      setRequestsSent(u.requests_sent || []);

      const theirProfiles = await Promise.all(
        (u.friends || []).map(async (id) => {
          const fs = await getDoc(doc(db, "users", id));
          if (!fs.exists()) return null;
          return { uid: id, ...fs.data() };
        })
      );

      setFriends(theirProfiles.filter(Boolean));
    });

    return () => unsub();
  }, [uid]);

  
  useEffect(() => {
    if (auth.currentUser) createUserIfMissing(auth.currentUser);
  }, [auth.currentUser]);

  
  const fetchUserProfile = useCallback(async (id) => {
    if (!id) return null;
    const s = await getDoc(doc(db, "users", id));
    return s.exists() ? { uid: s.id, ...s.data() } : null;
  }, []);

  const fetchLastMessage = useCallback(async (myUid, theirUid) => {
    try {
      const conv = getConversationId(myUid, theirUid);
      const q = query(
        collection(db, "conversations", conv, "messages"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);
      if (snap.empty) return null;

      const d = snap.docs[0].data();
      return {
        text: d.text,
        ts: d.createdAt?.toDate?.()?.toLocaleTimeString() || ""
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      const s = await getDoc(doc(db, "users", uid));
      if (!s.exists()) return;

      const u = s.data();
      const ids = Array.from(
        new Set([...u.friends, ...u.requests_received, ...u.requests_sent])
      );

      const data = await Promise.all(
        ids.map(async (id) => {
          const prof = await fetchUserProfile(id);
          const last = await fetchLastMessage(uid, id);

          return {
            id,
            name: prof?.name || prof?.username || "Unknown",
            avatar: prof?.photoURL || "/default-avatar.png",
            preview: last?.text || prof?.bio || "",
            time: last?.ts || ""
          };
        })
      );

      data.sort((a, b) =>
        a.time && b.time ? new Date(b.time) - new Date(a.time) : 0
      );

      setChats(data);

      if (!selectedChat && data.length > 0) {
        const c = data[0];
        setSelectedChat(c.id);
        setChatMeta({ name: c.name, avatar: c.avatar });
      }
    };

    load();
  }, [uid]);

  
  const handleSelectChat = async (id) => {
    const p = await fetchUserProfile(id);
    setSelectedChat(id);
    setChatMeta({ name: p?.name, avatar: p?.photoURL });

    setActiveTab(TABS.CHAT);
    setMobileSidebarOpen(false);
  };

 
  const handleSendRequest = async (id) => {
    if (!uid) return;

    if (friends.some((f) => f.uid === id)) return alert("Already friends");
    if (requestsSent.includes(id)) return alert("Already sent");
    if (requestsReceived.includes(id)) return alert("They sent you request");

    const ok = await sendRequest(uid, id);
    if (!ok) return alert("Failed");

    setRequestsSent((p) => [...p, id]);
  };

  const handleAccept = async (id) => {
    const ok = await acceptRequest(uid, id);
    if (!ok) return alert("Failed");

    setRequestsReceived((p) => p.filter((x) => x !== id));
    alert("Accepted");
  };

  const handleReject = async (id) => {
    const ok = await rejectRequest(uid, id);
    if (!ok) return alert("Failed");

    setRequestsReceived((p) => p.filter((x) => x !== id));
    alert("Rejected");
  };

  return (
    <div className="chathub-bg">
      <div className="chathub-shell">

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chats={chats}
          onSelectChat={handleSelectChat}
          profile={profile}
          friends={friends}
          requestsReceived={requestsReceived}
          requestsSent={requestsSent}
          onAccept={handleAccept}
          onReject={handleReject}
          onSendRequest={handleSendRequest}
          searchUser={searchUser}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        <div className="tab-anim" style={{ flex: 1, display: "flex" }}>
          {activeTab === TABS.CHAT && selectedChat && (
            <ChatWindow
              chatId={selectedChat}
              chatMeta={chatMeta}
              setMobileOpen={setMobileSidebarOpen}
            />
          )}

          {activeTab === TABS.FRIENDS && (
            <Friends
              friends={friends}
              onStartChat={handleSelectChat}
              setActiveTab={setActiveTab}
              setMobileOpen={setMobileSidebarOpen}
            />
          )}

          {activeTab === TABS.REQUESTS && (
            <Requests
              uid={uid}
              requests={requestsReceived}
              onAccept={handleAccept}
              onReject={handleReject}
              fetchUserProfile={fetchUserProfile}
              setActiveTab={setActiveTab}
              setMobileOpen={setMobileSidebarOpen}
            />
          )}

          {activeTab === TABS.PROFILE && (
            <Profile
              user={profile}
              onProfileUpdated={(data) =>
                setProfile((p) => ({ ...p, ...data }))
              }
              setActiveTab={setActiveTab}
              setMobileOpen={setMobileSidebarOpen}
            />
          )}
        </div>

      </div>
    </div>
  );
}
