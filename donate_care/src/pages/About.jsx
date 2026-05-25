import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <h1>About DonateCare</h1>
        <p>
          Connecting people in need with those who can help — instantly, transparently, and locally.
        </p>
      </section>

      {/* ===== MAIN PURPOSE ===== */}
      <section className="about-section">
        <h2>🌍 Our Mission</h2>
        <p>
          DonateCare is built to solve one critical problem — 
          **help should reach the right person at the right time**.
        </p>

        <p>
          Whether it’s blood donation, emergency support, or financial help, 
          our platform connects donors, NGOs, and people in need based on location.
        </p>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="about-grid">

        <div className="about-card">
          <h3>📍 Nearby Help</h3>
          <p>
            Find donors, requests, and NGOs near you within a 100km radius — 
            just like Swiggy/Zomato, but for saving lives.
          </p>
        </div>

        <div className="about-card">
          <h3>🚑 Emergency Support</h3>
          <p>
            Real-time emergency feed for urgent needs like blood, oxygen, or funds.
          </p>
        </div>

        <div className="about-card">
          <h3>💰 Transparent Donations</h3>
          <p>
            Track donations and ensure your contribution reaches the right place.
          </p>
        </div>

        <div className="about-card">
          <h3>🤝 Community Driven</h3>
          <p>
            Built for people, powered by people — helping each other locally.
          </p>
        </div>

      </section>

      {/* ===== CTA ===== */}
      <section className="about-cta">
        <h2>Be a part of the change ❤️</h2>
        <button onClick={() => navigate("/donate")}>
          Donate Now
        </button>
      </section>

    </div>
  );
}