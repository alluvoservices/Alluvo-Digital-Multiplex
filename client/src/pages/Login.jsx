import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login({ setGlobalLoading }) {
  const [mode, setMode] = useState("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function requestOtp(e) {
    e.preventDefault();
    setError("");
    setGlobalLoading?.(true);
    try {
      const payload = phone ? { phone } : { email };
      const res = await axios.post(`${API}/api/auth/request-otp`, payload);
      if (res.data.sent) setMode("otp");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setGlobalLoading?.(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    setError("");
    setGlobalLoading?.(true);
    try {
      const payload = phone ? { phone, code } : { email, code };
      const res = await axios.post(`${API}/api/auth/verify-otp`, payload);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.error || "Invalid code");
    } finally {
      setGlobalLoading?.(false);
    }
  }

  const inputStyle = {
    background: "#0a1326",
    border: "1px solid #1a2b4a",
    padding: "12px 14px",
    borderRadius: 12,
    color: "white",
    outline: "none"
  };

  return (
    <div className="page" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="logo" width="78" style={{ borderRadius: 12, boxShadow: "0 0 18px #0ff5" }} />
        <h2 style={{ marginBottom: 8 }}>Sign in to Alluvo</h2>
        <div style={{ color: "#9fb0cc" }}>OTP-only login (phone or email)</div>
      </div>

      {mode === "input" && (
        <form onSubmit={requestOtp} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Phone (+91xxxxxxxxxx) or leave empty to use email"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Email (use this if phone is empty)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button className="cta" type="submit" style={{ width: "100%" }}>Get OTP</button>
          {error && <div style={{ color: "#ff7a7a" }}>{error}</div>}
        </form>
      )}

      {mode === "otp" && (
        <form onSubmit={verify} style={{ display: "grid", gap: 12 }}>
          <div style={{ color: "#a8c3ff" }}>
            Enter the 6‑digit code sent to {phone || email}
          </div>
          <input
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={inputStyle}
            maxLength={6}
          />
          <button className="cta" type="submit" style={{ width: "100%" }}>Verify</button>
          {error && <div style={{ color: "#ff7a7a" }}>{error}</div>}
        </form>
      )}
    </div>
  );
}
