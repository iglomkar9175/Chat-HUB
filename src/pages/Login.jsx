import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") setError("No account found.");
      else if (err.code === "auth/invalid-email") setError("Invalid email.");
      else if (err.code === "auth/wrong-password") setError("Wrong password.");
      else setError("Login failed.");
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4">

      <div className="fade w-full max-w-sm backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">

        
        <div className="text-center mb-6">
          <div className="inline-block px-5 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 shadow mb-4">
            <h1 className="text-white text-4xl font-semibold">ChatHub</h1>
          </div>
          <h2 className="text-white text-lg">Welcome back</h2>
          <p className="text-white/70 text-xs mt-1">Sign in to continue to ChatHub</p>
        </div>

        <form onSubmit={submit} className="space-y-4">

          
          <div>
            <label className="text-white/90 text-xs">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 h-11 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
            </div>
          </div>

          
          <div>
            <label className="text-white/90 text-xs">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />

              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-10 h-11 bg-white/10 border border-white/30 rounded-xl 
                           text-white placeholder-white/40 outline-none focus:bg-white/20"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          
          <div className="flex justify-end -mt-2">
            <a href="/forgot-password" className="text-white/70 hover:text-white text-xs">
              Forgot password?
            </a>
          </div>

          
          {error && <p className="text-red-300 text-xs text-center">{error}</p>}

          
          <button
            type="button"
            onClick={googleLogin}
            className="w-full h-11 bg-white text-gray-900 rounded-xl shadow flex items-center 
                       justify-center gap-2 hover:scale-[1.02] transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" />
            Continue with Google
          </button>

          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-white/60 text-xs">or</span>
            </div>
          </div>

          
          <button
            type="submit"
            className="w-full h-11 bg-white text-gray-900 rounded-xl shadow font-semibold hover:scale-[1.02] transition"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-white/80 text-xs">
          Don’t have an account?{" "}
          <a href="/signup" className="underline hover:text-white/90">Sign up</a>
        </p>

      </div>
    </div>
  );
}
