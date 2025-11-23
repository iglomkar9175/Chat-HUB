import React, { useState, useEffect } from "react";

import { IoChatbubbleSharp } from "react-icons/io5";
import { FaUserFriends, FaRegUserCircle } from "react-icons/fa";
import { LuUserRoundPlus } from "react-icons/lu";


export default function Sidebar({
  activeTab,
  setActiveTab,
  chats = [],
  onSelectChat,
  profile,
  friends = [],
  requestsReceived = [],
  requestsSent = [],
  onAccept,
  onReject,
  onSendRequest,
  searchUser,
  mobileOpen,
  setMobileOpen,
}) {
  const [q, setQ] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const freshAvatar = profile?.photoURL
    ? `${profile.photoURL}?v=${Date.now()}`
    : "/default-avatar.png";

  
  useEffect(() => {
    let mounted = true;
    if (!q || q.trim().length < 2) {
      setSearchResult(null);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await searchUser(q.trim());
        if (!mounted) return;
        setSearchResult(res);
      } catch {
        setSearchResult(null);
      } finally {
        if (mounted) setSearchLoading(false);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [q, searchUser]);

  
  const goTab = (tab) => {
    setActiveTab(tab);
    
    setMobileOpen(false);
  };

  
  const isFriend = (uid) => friends.some((f) => f.uid === uid);
  const isRequestedSent = (uid) => (requestsSent || []).includes(uid);
  const isRequestedReceived = (uid) => (requestsReceived || []).includes(uid);

  return (
    <div className={`chathub-sidebar ${mobileOpen ? "open" : ""}`}>
      
      <button
        className="mobile-close"
        onClick={() => setMobileOpen(false)}
        style={{
          display: "none",
          background: "transparent",
          fontSize: 26,
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        ✕
      </button>

      
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <img
          src={freshAvatar}
          alt="avatar"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(255,255,255,0.15)",
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>ChatHub</div>
          {profile && (
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{profile.username}</div>
          )}
        </div>
      </div>

      
      <div className="chathub-tabs desktop-only" style={{ marginBottom: 12 }}>
        <div className={`chathub-tab ${activeTab === "CHAT" ? "active" : ""}`} onClick={() => goTab("CHAT")}>
          <IoChatbubbleSharp />
        </div>

        <div className={`chathub-tab ${activeTab === "FRIENDS" ? "active" : ""}`} onClick={() => goTab("FRIENDS")}>
          <FaUserFriends />
        </div>

        <div className={`chathub-tab ${activeTab === "REQUESTS" ? "active" : ""}`} onClick={() => goTab("REQUESTS")}>
          <LuUserRoundPlus />
        </div>

        <div className={`chathub-tab ${activeTab === "PROFILE" ? "active" : ""}`} onClick={() => goTab("PROFILE")}>
          <FaRegUserCircle />
        </div>
      </div>

     
      <div className="chathub-search" style={{ marginBottom: 10 }}>
        <input placeholder="Search username..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      
      {searchLoading && <div style={{ color: "white", fontSize: 13 }}>Searching...</div>}

      {searchResult && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            marginBottom: 12,
            display: "flex",
            gap: 10,
          }}
        >
          <img src={searchResult.photoURL || "/default-avatar.png"} style={{ width: 48, height: 48, borderRadius: "50%" }} />

          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700 }}>{searchResult.name || searchResult.username}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{searchResult.username}</div>

           
            {!isFriend(searchResult.uid) && !isRequestedSent(searchResult.uid) && !isRequestedReceived(searchResult.uid) && (
              <button
                onClick={() => onSendRequest(searchResult.uid)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  border: "none",
                  marginTop: 8,
                }}
              >
                Send Request
              </button>
            )}

            {isRequestedSent(searchResult.uid) && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 8 }}>Request Sent</div>}

            {isRequestedReceived(searchResult.uid) && (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => onAccept(searchResult.uid)} style={{ padding: "6px 10px", background: "#22c55e", borderRadius: 8, border: "none" }}>
                  Accept
                </button>

                <button
                  onClick={() => onReject(searchResult.uid)}
                  style={{
                    padding: "6px 10px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6 }}>Messages</div>

      <div className="chathub-list">
        {chats.length === 0 && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>No chats yet — start a conversation</div>}

        {chats.map((c) => (
          <div
            key={c.id}
            className="item"
            onClick={() => {
              onSelectChat(c.id);
              setMobileOpen(false); // close drawer when user opens a chat on mobile
            }}
          >
            <img src={c.avatar || "/default-avatar.png"} className="avatar" alt="" />

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "white", fontWeight: 600 }}>{c.name}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{c.time}</div>
              </div>

              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>{c.preview}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
