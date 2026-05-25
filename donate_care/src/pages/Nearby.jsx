import { useEffect, useState } from "react";
import axios from "axios";
import "./Nearby.css";

export default function Nearby() {
  const [data, setData] = useState({ donations: [], helps: [] });

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("location"));

    if (!location) {
      loadDummy();
      return;
    }

    axios
      .get(
        `http://localhost:5001/api/auth/nearby-feed?lat=${location.latitude}&lng=${location.longitude}`
      )
      .then((res) => {
        if (
          res.data.donations.length === 0 &&
          res.data.helps.length === 0
        ) {
          loadDummy(); // fallback
        } else {
          setData(res.data);
        }
      })
      .catch(() => loadDummy());
  }, []);

  // 🔥 Dummy data (clean + realistic)
  const loadDummy = () => {
    setData({
      helps: [
        {
          type: "Blood Needed",
          detail: "O+ Urgent",
          distance: 1.2,
        },
        {
          type: "Oxygen Supply",
          detail: "3 Cylinders Required",
          distance: 2.5,
        },
      ],
      donations: [
        {
          type: "Money Donation",
          amount: 5000,
          distance: 0.8,
        },
        {
          type: "Blood Donor",
          bloodGroup: "A+",
          distance: 3.1,
        },
      ],
    });
  };

  return (
    <div className="nearby-container">
      <h2>📍 Nearby Activity</h2>

      <div className="grid">
        {/* HELP REQUESTS */}
        {data.helps.map((h, i) => (
          <div className="card urgent" key={i}>
            <div className="badge">URGENT</div>
            <h4>{h.type}</h4>
            <p>{h.detail}</p>
            <span>{h.distance.toFixed(1)} km away</span>
          </div>
        ))}

        {/* DONATIONS */}
        {data.donations.map((d, i) => (
          <div className="card" key={i}>
            <h4>{d.type}</h4>
            {d.amount && <p>₹ {d.amount}</p>}
            {d.bloodGroup && <p>{d.bloodGroup}</p>}
            <span>{d.distance.toFixed(1)} km away</span>
          </div>
        ))}
      </div>
    </div>
  );
}