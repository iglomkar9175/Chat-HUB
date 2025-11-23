import React, { useEffect, useState } from "react";

export default function Requests({
  uid,
  requests = [],
  onAccept,
  onReject,
  fetchUserProfile,
  setActiveTab,       
  setMobileOpen,      
}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfiles = async () => {
      setLoading(true);

      const arr = [];
      for (const id of requests) {
        const p = await fetchUserProfile(id);
        if (p) arr.push(p);
      }

      if (mounted) setProfiles(arr);
      setLoading(false);
    };

    loadProfiles();
    return () => (mounted = false);
  }, [requests]);

  
  const handleBack = () => {
    setActiveTab("CHAT");     // go to home
    setMobileOpen(true);      // open sidebar
  };

  return (
    <div className="content-panel scroll-page">

      
      <div
        className="mobile-only"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 14,
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

      <h3 style={{ color: "white", fontWeight: 700 }}>Friend Requests</h3>
      <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
        {requests.length} pending requests
      </p>

      <div className="scroll-body" style={{ marginTop: 16 }}>
        {loading && (
          <div style={{ color: "white", marginTop: 20 }}>Loading…</div>
        )}

        {!loading && profiles.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
            No pending requests 
          </div>
        )}

        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          {profiles.map((r) => (
            <div
              key={r.uid}
              style={{
                padding: 18,
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img
                  src={r.photoURL || "/default-avatar.png"}
                  alt=""
                  style={{ width: 56, height: 56, borderRadius: "999px" }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: "white" }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    Requested you
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => onAccept(r.uid)}
                  style={{
                    background: "#10B981",
                    color: "#062F2E",
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "none",
                  }}
                >
                  Accept
                </button>

                <button
                  onClick={() => onReject(r.uid)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
