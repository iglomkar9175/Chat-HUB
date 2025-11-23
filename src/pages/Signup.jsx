import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Mail, Lock, User } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

 
  const saveUserToFirestore = async (user, name) => {
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      uid: user.uid,
      name: name || user.displayName || "User",
      username:
        name?.toLowerCase() ||
        user.displayName?.toLowerCase() ||
        user.email.split("@")[0],
      email: user.email,
      photoURL: user.photoURL || "",
      bio: "I'm using ChatHub 💬",
      friends: [],
      requests_received: [],
      requests_sent: [],
      createdAt: serverTimestamp(),
    });
  };

  
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Passwords do not match.");

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(user.user, { displayName: username });

      await saveUserToFirestore(user.user, username);
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("Email already exists.");
      else setError("Signup failed.");
    }
  };

 
  const googleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const gUser = result.user;

      await saveUserToFirestore(gUser, gUser.displayName);
    } catch (err) {
      console.error(err);
      setError("Google signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-slate-600 to-slate-600 p-4">

      <div className="fade w-full max-w-sm backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-2xl">

        <div className="text-center mb-5">
          <div className="inline-block px-4 py-2 rounded-full bg-white/15 border border-white/30 backdrop-blur-xl shadow mb-3">
            <h1 className="text-white text-3xl font-semibold">ChatHub</h1>
          </div>
          <h2 className="text-white text-base font-medium">Create account</h2>
          <p className="text-white/70 text-xs">Join ChatHub today</p>
        </div>

        <form onSubmit={submit} className="space-y-3">

          
          <div>
            <label className="text-white/90 text-xs">Username</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 h-10 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-white/90 text-xs">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 h-10 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
            </div>
          </div>

          
          <div>
            <label className="text-white/90 text-xs">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 h-10 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          
          <div>
            <label className="text-white/90 text-xs">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full pl-10 pr-10 h-10 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-300 text-xs text-center">{error}</p>}

          
          <button
            type="button"
            onClick={googleSignup}
            className="w-full h-10 bg-white text-gray-900 rounded-xl shadow flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-white/60 text-xs">or</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-white text-gray-900 rounded-xl shadow font-semibold hover:scale-[1.02] transition"
          >
            Create account
          </button>
        </form>

        <p className="mt-3 text-center text-white/80 text-xs">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-white/90">Login</a>
        </p>

      </div>
    </div>
  );
}
