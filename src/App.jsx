import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatHub from "./pages/ChatHub";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-white/70">
        Loading...
      </div>
    );
  }

  return (
    <>
     
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(0,0,0,0.65)",
            color: "white",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
          },
        }}
      />

     
      <Router>
        <Routes>
          
          <Route
            path="/"
            element={user ? <ChatHub /> : <Navigate to="/login" replace />}
          />

          
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}
