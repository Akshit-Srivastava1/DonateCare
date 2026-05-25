import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [nearby, setNearby] = useState({ donations: [], helps: [] });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      localStorage.setItem(
        "location",
        JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      );
    },
    (err) => console.log(err)
  );
}, []);

  useEffect(() => {
  const location = JSON.parse(localStorage.getItem("location"));
  if (!location) return;

  fetch(`http://localhost:5001/api/auth/nearby-feed?lat=${location.latitude}&lng=${location.longitude}`)
    .then(res => res.json())
    .then(data => setNearby(data))
    .catch(err => console.log(err));
}, []);

  const handleHelp = (type, detail) => {
    navigate("/emergency", {
      state: { type, detail }
    });
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="container">

          <div className="logo">
            <img src="/src/assets/logo.png" alt="logo" className="logo-icon"/>
            <div className="logo-text">
              <span className="logo-blue">Donate</span>
              <span className="logo-green">Care</span>
            </div>
          </div>

          <nav className="nav-links">
            <Link to="/donations">Donations</Link>
            <Link to="/blood">Blood Donation</Link>
            <Link to="/emergency">Emergency</Link>

            {user ? (
              <div className="profile-menu" ref={dropdownRef}>
                <button
                  className="profile-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.name}
                </button>

                {menuOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate("/profile")}>
                      👤 Profile
                    </button>

                    <button onClick={logout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </nav>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">

          <div className="hero-content">
            <h1>
              Connecting Hearts,<br />
              <span className="text-highlight">Saving Lives.</span>
            </h1>

            <p>
              A unified digital ecosystem for emergency support,
              blood donation, and transparent NGO contributions.
            </p>

            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg donate-big premium-btn" onClick={() => navigate("/donate")}>
                ❤️ Donate Now
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="glass-card impact-card">
              <h3>Total Impact</h3>
              <div className="stat">10k</div>
              <p>Lives Touched</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats-strip">
        <div className="container">

          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Partner Hospitals</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">20</span>
            <span className="stat-label">Verified NGOs</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">10cr+</span>
            <span className="stat-label">Donations Raised</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">500</span>
            <span className="stat-label">Active Donors</span>
          </div>

        </div>
      </section>

      {/* ================= EMERGENCY FEED ================= */}
      <section className="emergency-feed container">
        <div className="section-header">
          <span className="badge badge-red">LIVE</span>
          <h2>Emergency Response Feed</h2>
          <p>Real-time emergency requests requiring immediate attention.</p>
        </div>

        <div className="feed-grid">
          {[
            {
              id: 1,
              type: "Blood Needed",
              location: "City Hospital",
              patient: "A+ Required",
              time: "2m ago",
              urgency: "High"
            },
            {
              id: 2,
              type: "Oxygen Supply",
              location: "Care Unit",
              patient: "5 Cylinders",
              time: "15m ago",
              urgency: "Critical"
            },
            {
              id: 3,
              type: "Emergency Funds",
              location: "Health Center",
              patient: "₹200k Goal",
              time: "1h ago",
              urgency: "Medium"
            }
          ].map(item => (
            <div key={item.id} className="feed-card">

              <div className="card-top">
                <span className={`urgency ${item.urgency.toLowerCase()}`}>
                  {item.urgency}
                </span>
                <span className="time">{item.time}</span>
              </div>

              <h3>{item.type}</h3>
              <p>📍 {item.location}</p>
              <p>{item.patient}</p>

              {/* ✅ UPDATED BUTTON */}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleHelp(item.type, item.patient)}
              >
                Help Now
              </button>

            </div>
          ))}
        </div>
      </section>

<section className="nearby-section container">
  <h2>📍 Nearby Activity</h2>

  <div className="feed-grid">

  {nearby.helps.length === 0 && nearby.donations.length === 0 && (
    <>
      <div className="feed-card urgent">
        <h3>Blood Needed</h3>
        <p>O+ Urgent</p>
        <span>1.2 km away</span>
      </div>

      <div className="feed-card urgent">
        <h3>Oxygen Supply</h3>
        <p>3 Cylinders Required</p>
        <span>2.5 km away</span>
      </div>

      <div className="feed-card">
        <h3>Money Donation</h3>
        <p>₹ 5000</p>
        <span>0.8 km away</span>
      </div>

      <div className="feed-card">
        <h3>Blood Donor</h3>
        <p>🩸 A+</p>
        <span>3.1 km away</span>
      </div>
    </>
  )}

  {nearby.helps.map((h, i) => (
    <div className="feed-card urgent" key={i}>
      <h3>{h.type}</h3>
      <p>{h.detail}</p>
      <span>{h.distance?.toFixed(1)} km away</span>
    </div>
  ))}

  {nearby.donations.map((d, i) => (
    <div className="feed-card" key={i}>
      <h3>{d.type}</h3>

      {d.amount && <p>₹ {d.amount}</p>}
      {d.bloodGroup && <p>🩸 {d.bloodGroup}</p>}
      {d.item && <p>🎁 {d.item}</p>}

      <span>{d.distance?.toFixed(1)} km away</span>
    </div>
  ))}

</div>
</section>

      <footer className="footer">
        <div className="container">

          <div className="footer-content">

            <div>
              <h2>
                <span className="logo-blue">Donate</span>
                <span className="logo-green">Care</span>
              </h2>
              <p>Making donations transparent & accessible.</p>
            </div>

            <div>
              <h4>Platform</h4>
              <p style={{ cursor: "pointer" }} onClick={() => navigate("/about")}> About
              </p>
            </div>

            <div>
              <h4>Support</h4>
              <p style={{ cursor: "pointer" }} onClick={() => navigate("/contact")}> Contact
              </p>

              <p style={{ cursor: "pointer" }} onClick={() => navigate("/faq")}> FAQ
              </p>
            </div>

          </div>

          <p className="footer-bottom">
            © 2026 DonateCare. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;


