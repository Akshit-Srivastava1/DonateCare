import { useEffect, useState } from "react";
import axios from "axios";
import "./BloodDonors.css";

export default function BloodDonors() {
  const [donors, setDonors] = useState([]);
  const [group, setGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5001/api/auth/blood-donors?group=${group}`
      );

      setDonors(res.data.donors || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();

    const interval = setInterval(fetchDonors, 5000);

    return () => clearInterval(interval);
  }, [group]);

  return (
    <div className="blood-container">

      <div className="blood-header">
        <h1>🩸 Live Blood Donors</h1>
        <p>Find real donors instantly from your database</p>
      </div>

      <div className="blood-filter">
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="blood-select"
        >
          <option value="">All Blood Groups</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
          <option>A-</option>
          <option>B-</option>
          <option>O-</option>
          <option>AB-</option>
        </select>
      </div>

      {/* STATES */}
      {loading && <p className="status-msg">Loading donors...</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="blood-grid">
        {!loading && donors.length === 0 ? (
          <p className="status-msg">No donors found</p>
        ) : (
          donors.map((d, i) => (
            <div className="blood-card" key={i}>

              <div className="blood-top">
                <h3>{d.name}</h3>
                <span className="blood-badge">
                  {d.bloodGroup || "N/A"}
                </span>
              </div>

              <p className="blood-email">📧 {d.email}</p>

              {d.message && (
                <p className="blood-message">
                  💬 {d.message}
                </p>
              )}

              <button
                className="contact-btn"
                onClick={() => window.location.href = `mailto:${d.email}`}
              >
                📩 Contact
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
