import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CrimeMap from "./components/CrimeMap";
import ReportCrime from "./components/ReportCrime";
import HotspotMap from "./components/HotspotMap";
import DistrictCrimeChart from "./components/DistrictCrimeChart";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  if (!isLoggedIn) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login
        onLogin={setIsLoggedIn}
        switchToSignup={() => setShowSignup(true)}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Header onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<CrimeMap />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/hotspot" element={<HotspotMap />} />
        <Route path="/chart" element={<DistrictCrimeChart />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
