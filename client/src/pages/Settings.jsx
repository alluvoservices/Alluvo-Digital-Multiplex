import React from "react";

export default function Settings() {
  function setTheme(c1, c2, c3) {
    const root = document.documentElement.style;
    root.setProperty("--neon-1", c1);
    root.setProperty("--neon-2", c2);
    root.setProperty("--neon-3", c3);
    root.setProperty("--accent", c1);
  }
  return (
    <div className="page">
      <h2>Theme settings</h2>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Theme onClick={() => setTheme("#00e6ff", "#5fff9f", "#ff4dff")} c1="#00e6ff" c2="#5fff9f" c3="#ff4dff" label="Neon Mix" />
        <Theme onClick={() => setTheme("#31e5ff", "#00ffd1", "#7a7dff")} c1="#31e5ff" c2="#00ffd1" c3="#7a7dff" label="Aqua" />
        <Theme onClick={() => setTheme("#ff7ac6", "#ffe983", "#7cffcb")} c1="#ff7ac6" c2="#ffe983" c3="#7cffcb" label="Candy" />
      </div>
    </div>
  );
}

function Theme({ c1, c2, c3, label, onClick }) {
  return (
    <button onClick={onClick} style={{ background: "#0f1628", border: "1px solid #1b2b4a", borderRadius: 12, padding: 8, color: "white", cursor: "pointer" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <Swatch c={c1} /><Swatch c={c2} /><Swatch c={c3} />
      </div>
      {label}
    </button>
  );
}
const Swatch = ({ c }) => <div style={{ width: 22, height: 22, borderRadius: 6, background: c, boxShadow: `0 0 12px ${c}88` }} />;
