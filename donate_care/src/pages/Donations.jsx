import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Donations() {
  const [data, setData] = useState([]);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/auth/donations");
      setData(res.data.donations || []);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  // 🔥 Split data
  const moneyDonations = data.filter((d) => d.type === "money");
  const otherDonations = data.filter((d) => d.type === "other");

  // 💰 Total Money Calculation
  const totalMoney = moneyDonations.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  // ✅ Animation
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = totalMoney / (duration / 16);

    const counter = setInterval(() => {
      start += increment;

      if (start >= totalMoney) {
        setAnimatedTotal(totalMoney);
        clearInterval(counter);
      } else {
        setAnimatedTotal(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [totalMoney]);

  return (
    <div className="page">
      <h2>All Donations</h2>

      {/* 💰 TOTAL */}
      <div className="total-card">
        <h3>Total Money Collected</h3>
        <p>₹ {animatedTotal.toLocaleString()}</p>
      </div>

      {/* ↔️ HORIZONTAL ROW */}
      <div className="sections-row">

        {/* 💰 MONEY SECTION */}
        <div className="card">
          <h3>💰 Money Donations</h3>

          <div className="card-content">
            {moneyDonations.length === 0 ? (
              <p className="empty-state">No money donations yet</p>
            ) : (
              moneyDonations.map((d, i) => (
                <div key={i} className="inner-card">
                  <p><b>{d.name || "Anonymous"}</b></p>
                  <p>{d.email || "No email"}</p>
                  <p>₹ {d.amount || 0}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🎁 OTHER SECTION */}
        <div className="card">
          <h3>🎁 Other Donations</h3>

          <div className="card-content">
            {otherDonations.length === 0 ? (
              <p className="empty-state">No item donations yet</p>
            ) : (
              otherDonations.map((d, i) => (
                <div key={i} className="inner-card">
                  <p><b>{d.name || "Anonymous"}</b></p>
                  <p>{d.email || "No email"}</p>
                  <p>Item: {d.item || "N/A"}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}