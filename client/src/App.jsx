import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import LoaderOverlay from "./components/LoaderOverlay.jsx";
import OpeningVideo from "./components/OpeningVideo.jsx";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("intro-seen");
    if (seen) setShowIntro(false);
  }, []);

  function onIntroEnd() {
    sessionStorage.setItem("intro-seen", "1");
    setShowIntro(false);
  }

  return (
    <div className="app">
      {showIntro && <OpeningVideo onEnd={onIntroEnd} />}
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home setGlobalLoading={setLoading} />} />
          <Route path="/login" element={<Login setGlobalLoading={setLoading} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stream" element={<div className="page">Stream</div>} />
          <Route path="/order" element={<div className="page">Order</div>} />
          <Route path="/friends" element={<div className="page">Friends</div>} />
          <Route path="/tickets" element={<div className="page">Tickets</div>} />
          <Route path="/playzone" element={<div className="page">Playzone</div>} />
        </Routes>
      </main>
      <LoaderOverlay show={loading} />
    </div>
  );
}
