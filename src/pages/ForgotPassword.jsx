import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const reset = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Password reset link sent!");
    } catch (err) {
      setError("Unable to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4">
      <div className="fade w-full max-w-sm backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">

        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-semibold">Reset Password</h1>
          <p className="text-white/70 text-xs mt-2">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={reset} className="space-y-4">
          <label className="text-white/90 text-xs">Email</label>

          <div className="relative">
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

          {msg && <p className="text-green-300 text-xs text-center">{msg}</p>}
          {error && <p className="text-red-300 text-xs text-center">{error}</p>}

          <button
            type="submit"
            className="w-full h-11 bg-white text-gray-900 rounded-xl shadow font-semibold hover:scale-[1.02] transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-4 text-center text-white/80 text-xs">
          Back to{" "}
          <a href="/login" className="underline hover:text-white/90">Login</a>
        </p>

      </div>
    </div>
  );
}
