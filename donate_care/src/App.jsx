import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Donations from "./pages/Donations";
import BloodDonors from "./pages/BloodDonors";
import AdminDashboard from "./pages/AdminDashboard";
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import Emergency from "./pages/Emergency";
import Chatbot from "./components/Chatbot";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  useEffect(() => {
    if (!localStorage.getItem("location")) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          localStorage.setItem(
            "location",
            JSON.stringify({ latitude, longitude })
          );

          console.log("Location saved:", latitude, longitude);
        },
        (err) => {
          console.log("Location permission denied", err);
        }
      );
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/blood" element={<BloodDonors />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Chatbot />
    </>
  );
}

export default App;