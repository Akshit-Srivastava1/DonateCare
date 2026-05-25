import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axios
      .get(`http://localhost:5001/api/auth/profile/${user.id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Profile error:", err);
      });
  }, []);

  if (!data) return <h2 className="loading">Loading...</h2>;

  const { user, donations, helps } = data;

  return (
    <div className="profile-container">
      
      {/* USER CARD */}
      <div className="profile-card">
        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <div className="profile-stats">
          <div>
            <h3>{donations.length}</h3>
            <p>Donations</p>
          </div>
          <div>
            <h3>{helps.length}</h3>
            <p>Help Requests</p>
          </div>
        </div>
      </div>

      {/* DONATIONS */}
      <div className="section">
        <h3>My Donations</h3>

        <div className="grid">
          {donations.length === 0 ? (
            <p>No donations yet</p>
          ) : (
            donations.map((d, i) => (
              <div className="card" key={i}>
                <h4>{d.type.toUpperCase()}</h4>

                {d.amount && <p>₹ {d.amount}</p>}
                {d.bloodGroup && <p>{d.bloodGroup}</p>}
                {d.item && <p>{d.item}</p>}

                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* HELP REQUESTS */}
      <div className="section">
        <h3>My Help Requests</h3>

        <div className="grid">
          {helps.length === 0 ? (
            <p>No requests yet</p>
          ) : (
            helps.map((h, i) => (
              <div className="card help-card" key={i}>
                <h4>{h.type}</h4>
                <p>{h.detail}</p>
                <span>{new Date(h.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}