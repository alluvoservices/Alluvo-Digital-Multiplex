import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Hero({ slides }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);
  const s = slides[i];
  return (
    <div className="hero" style={{ backgroundImage: `url(${s.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="slide" style={{ backdropFilter: "blur(2px)" }}>
        <div>
          <h1>{s.title}</h1>
          <div className="tag">{s.tag}</div>
          <button className="cta">{s.cta}</button>
        </div>
        <img className="poster" src={s.poster} alt={s.title} />
      </div>
      <div className="dots">
        {slides.map((_, idx) => <div key={idx} className={"dot" + (idx === i ? " active" : "")} />)}
      </div>
    </div>
  );
}

function Row({ title, items }) {
  return (
    <>
      <div className="section-title">{title}</div>
      <div className="row">
        {items.map((m) => (
          <div className="card" key={m.id}>
            <img src={m.thumb} alt={m.title} />
            <div className="meta">{m.title}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Home({ setGlobalLoading }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function run() {
      setGlobalLoading?.(true);
      try {
        const res = await axios.get(`${API}/api/content/home`);
        setData(res.data);
      } finally {
        setGlobalLoading?.(false);
      }
    }
    run();
  }, []);

  if (!data) return null;
  return (
    <div>
      <Hero slides={data.hero} />
      {data.rows.map((r, idx) => <Row key={idx} title={r.title} items={r.items} />)}
    </div>
  );
}
