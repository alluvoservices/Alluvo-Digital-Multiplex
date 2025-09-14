import React from "react";
import { NavLink } from "react-router-dom";

const Icon = ({ children }) => (
  <span style={{ width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </span>
);

export default function Sidebar() {
  const base = import.meta.env.BASE_URL || "/";
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={`${base}logo.jpg`} alt="logo" />
        <div className="name">Alluvo</div>
      </div>

      <nav className="nav">
        <NavLink className="item" to="/"><Icon>🔍</Icon><span className="label">Search</span></NavLink>
        <NavLink className="item" to="/stream"><Icon>🎞️</Icon><span className="label">Stream</span></NavLink>
        <NavLink className="item" to="/order"><Icon>🍱</Icon><span className="label">Order</span></NavLink>
        <NavLink className="item" to="/friends"><Icon>��</Icon><span className="label">Friends</span></NavLink>
        <NavLink className="item" to="/tickets"><Icon>🎟️</Icon><span className="label">Tickets</span></NavLink>
        <NavLink className="item" to="/playzone"><Icon>🕹️</Icon><span className="label">Playzone</span></NavLink>
        <NavLink className="item" to="/settings"><Icon>⚙️</Icon><span className="label">Settings</span></NavLink>
        <NavLink className="item" to="/login"><Icon>🔐</Icon><span className="label">Login</span></NavLink>
      </nav>
    </aside>
  );
}
