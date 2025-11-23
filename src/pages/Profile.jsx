import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../utils/uploadImage";

export default function Profile({ user, onProfileUpdated }) {
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return (
      <div className="content-panel scroll-page">
        <div style={{ color: "white", fontSize: 18 }}>Loading profile...</div>
      </div>
    );
  }

  const handleFileSelect = (e) => {
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
      alert("Upload failed ");
    }
    setUploading(false);
  };

  return (
    <div className="content-panel scroll-page">
      <div className="scroll-body">
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "white" }}>
          Your Profile
        </h2>

        <div style={{ display: "flex", gap: 18, marginTop: 20 }}>
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
              type="file"
              id="avatarInput"
              accept="image/*"
              onChange={handleFileSelect}
              hidden
            />

            <label
              htmlFor="avatarInput"
              style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Choose New Avatar
            </label>

            <button
              onClick={uploadAvatar}
              disabled={!file || uploading}
              style={{
                padding: "10px 14px",
                background: uploading ? "gray" : "#6d5dfc",
                borderRadius: 10,
                color: "white",
                border: "none",
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
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

        <button
          onClick={() => auth.signOut()}
          style={{
            marginTop: 40,
            padding: "12px 18px",
            background: "#EF4444",
            color: "white",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
