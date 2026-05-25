import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/auth/my-donations/${user.id}`
      );

      setData(res.data.donations || []);
      setLoading(false);

    } catch (error) {
      console.error("Dashboard error:", error);
      setLoading(false);
    }
  };

  // ================= STATS =================
  const total = data.length;

  const money = data
    .filter(d => d.type === "money")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const blood = data.filter(d => d.type === "blood").length;

  return (
    <div className="page">

      <h2>My Dashboard</h2>

      {/* LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ================= STATS ================= */}
          <div className="stats">

            <div className="stat-card">
              <h3>{total}</h3>
              <p>Total Donations</p>
            </div>

            <div className="stat-card">
              <h3>₹ {money}</h3>
              <p>Total Money</p>
            </div>

            <div className="stat-card">
              <h3>{blood}</h3>
              <p>Blood Donations</p>
            </div>

          </div>

          {/* ================= RECENT ================= */}
          <h3>Recent Donations</h3>

          {data.length === 0 ? (
            <p>No donations yet</p>
          ) : (
            <div className="grid">

              {data.slice(0, 6).map((d, i) => (
                <div className="card" key={i}>

                  <h4>{d.name}</h4>

                  <p><b>Type:</b> {d.type}</p>

                  {d.type === "money" && (
                    <p>₹ {d.amount}</p>
                  )}

                  {d.type === "blood" && (
                    <p>Blood: {d.bloodGroup}</p>
                  )}

                  {d.type === "other" && (
                    <p>Item: {d.item}</p>
                  )}

                </div>
              ))}

            </div>
          )}
        </>
      )}

    </div>
  );
}