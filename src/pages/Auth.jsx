import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(auth.currentUser);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-white/30 placeholder-white text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white/30 placeholder-white text-white"
            required
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-white text-indigo-600 rounded-lg py-2 font-semibold mt-2 hover:bg-gray-100"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p
          onClick={() => setIsSignup(!isSignup)}
          className="mt-4 text-center text-sm cursor-pointer hover:underline"
        >
          {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
        </p>
      </div>
    </div>
  );
}
