import React from "react";

export default function Friends({
  friends = [],
  onStartChat,
  setActiveTab,     
  setMobileOpen,    
}) {
  const online = friends.filter((f) => f.status === "online");
  const offline = friends.filter((f) => f.status !== "online");

  
  const handleBack = () => {
    setActiveTab("CHAT");
    setMobileOpen(true); 
  };

  return (
    <div className="content-panel scroll-page">

      
      <div
        className="mobile-only"
        style={{
          display: "none",
          paddingBottom: 10,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: 10,
            fontSize: 14,
          }}
        >
          ← Back
        </button>
      </div>

      <h3 style={{ color: "white", fontWeight: 700 }}>My Friends</h3>
      <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
        {friends.length} friends
      </p>

      <div className="scroll-body" style={{ marginTop: 14 }}>
        <h5 style={{ color: "rgba(255,255,255,0.6)", marginTop: 10 }}>
          Online — {online.length}
        </h5>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 12,
          }}
        >
          {online.map((f) => (
            <div
              key={f.uid}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                src={f.photoURL || "/default-avatar.png"}
                alt=""
                style={{ width: 56, height: 56, borderRadius: "999px" }}
              />

              <div>
                <div style={{ fontWeight: 600, color: "white" }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                  {f.username}
                </div>
              </div>

              <button
                onClick={() => onStartChat && onStartChat(f.uid)}
                style={{
                  marginLeft: "auto",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  color: "white",
                }}
              >
                Message
              </button>
            </div>
          ))}
        </div>

        <h5 style={{ color: "rgba(255,255,255,0.6)", marginTop: 20 }}>
          Offline — {offline.length}
        </h5>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 12,
            paddingBottom: 30,
          }}
        >
          {offline.map((f) => (
            <div
              key={f.uid}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                src={f.photoURL || "/default-avatar.png"}
                alt=""
                style={{ width: 56, height: 56, borderRadius: "999px" }}
              />

              <div>
                <div style={{ fontWeight: 600, color: "white" }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  {f.username}
                </div>
              </div>

              <button
                onClick={() => onStartChat && onStartChat(f.uid)}
                style={{
                  marginLeft: "auto",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  color: "white",
                }}
              >
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
