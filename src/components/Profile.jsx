import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../utils/uploadImage";

export default function Profile({
  user,
  onProfileUpdated,
  setActiveTab,
  setMobileOpen,
}) {
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return (
      <div className="content-panel">
        <div style={{ color: "white", fontSize: 18 }}>Loading profile…</div>
      </div>
    );
  }

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const uploadAvatar = async () => {
    if (!file) return alert("Select an image first ");

    setUploading(true);
    try {
      const url = await uploadImage(file, "avatars");

      await updateDoc(doc(db, "users", user.uid), { photoURL: url });

      onProfileUpdated?.({ photoURL: url });

      alert("Avatar updated ");
    } catch (err) {
      console.error(err);
      alert("Upload failed ");
    }
    setUploading(false);
  };

  return (
    <div
      className="content-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        color: "white",
      }}
    >
     
      <div
        className="mobile-only"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          cursor: "pointer",
        }}
        onClick={() => {
          setActiveTab("CHAT");
          setMobileOpen(true);
        }}
      >
        <span style={{ fontSize: 22 }}>←</span>
        <span style={{ fontWeight: 700 }}>Back</span>
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Your Profile</h2>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: 20,
          paddingRight: 10,
          minHeight: 0,
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <img
            src={preview || "/default-avatar.png"}
            alt="avatar"
            style={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.1)",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              hidden
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />

            <label
              htmlFor="avatarInput"
              style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 10,
                color: "white",
                cursor: "pointer",
              }}
            >
              Choose New Avatar
            </label>

            <button
              disabled={!file || uploading}
              onClick={uploadAvatar}
              style={{
                padding: "10px 14px",
                background: uploading ? "gray" : "#6d5dfc",
                borderRadius: 10,
                color: "white",
                cursor: uploading ? "not-allowed" : "pointer",
                border: "none",
              }}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ opacity: 0.7 }}>Name</div>
            <div style={{ fontSize: 20 }}>{user.name}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ opacity: 0.7 }}>Username</div>
            <div style={{ fontSize: 20 }}>{user.username}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ opacity: 0.7 }}>Email</div>
            <div style={{ fontSize: 20 }}>{user.email}</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => auth.signOut()}
        style={{
          padding: "12px 18px",
          background: "#EF4444",
          borderRadius: 10,
          border: "none",
          color: "white",
          cursor: "pointer",
          flexShrink: 0,
          marginTop: 20,
        }}
      >
        Log Out
      </button>
    </div>
  );
}
