import { useEffect, useState } from "react";
import "./Emergency.css";

export default function Emergency() {
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // ✅ NEW STATE
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    const data = [
      {
        id: 1,
        type: "Blood Needed",
        hospital: "City Hospital",
        detail: "A+ Required",
        priority: "high",
        time: "2m ago",
      },
      {
        id: 2,
        type: "Oxygen Supply",
        hospital: "Care Unit",
        detail: "5 Cylinders",
        priority: "critical",
        time: "15m ago",
      },
      {
        id: 3,
        type: "Emergency Funds",
        hospital: "Health Center",
        detail: "₹200k Goal",
        priority: "medium",
        time: "1h ago",
      },
    ];

    setRequests(data);
  }, []);

  const handleHelpClick = (req) => {
    setSelected(req);
    setOpenModal(true);
  };

  return (
    <div className="emergency-container">
      
      {/* HEADER */}
      <div className="header">
        <div className="header-top">
          <span className="live-badge">LIVE</span>

          {/* ✅ FIXED BUTTON */}
          <button className="add-btn" onClick={() => setAddModal(true)}>
            + Add Emergency
          </button>
        </div>

        <h2>Emergency Response Feed</h2>
        <p>Real-time emergency requests requiring immediate attention.</p>
      </div>

      {/* GRID */}
      <div className="emergency-grid">
        {requests.map((req) => (
          <div className="emergency-card" key={req.id}>
            
            <div className="top">
              <span className={`priority ${req.priority}`}>
                {req.priority.toUpperCase()}
              </span>
              <span className="time">{req.time}</span>
            </div>

            <h3>{req.type}</h3>
            <p className="location">📍 {req.hospital}</p>
            <p className="detail">{req.detail}</p>

            <button
              className="help-btn"
              onClick={() => handleHelpClick(req)}
            >
              Help Now
            </button>
          </div>
        ))}
      </div>

      {/* ================= HELP MODAL ================= */}
      {openModal && selected && (
        <div className="modal-overlay" onClick={() => setOpenModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Help for {selected.type}</h3>

            <form
              className="modal-form"
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                const user = JSON.parse(localStorage.getItem("user"));
                const location = JSON.parse(localStorage.getItem("location"));

                const payload = {
                  userId: user?.id,
                  name: formData.get("name"),
                  email: formData.get("email"),
                  type: selected.type,
                  detail: selected.detail,
                  message: formData.get("message"),
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                };

                try {
                  await fetch("http://localhost:5001/api/auth/help", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  alert("✅ Help request submitted!");
                  setOpenModal(false);

                } catch (err) {
                  console.error(err);
                  alert("❌ Error submitting request");
                }
              }}
            >
              <input name="name" type="text" placeholder="Your Name" required />
              <input name="email" type="email" placeholder="Your Email" required />

              {selected.type === "Blood Needed" && (
                <input type="text" placeholder="Your Blood Group" />
              )}

              {selected.type === "Oxygen Supply" && (
                <input type="number" placeholder="No. of Cylinders you can provide" />
              )}

              {selected.type === "Emergency Funds" && (
                <input type="number" placeholder="Amount you want to donate" />
              )}

              <textarea name="message" placeholder="Message (optional)" />

              <button type="submit" className="submit-btn">
                Submit Help
              </button>
            </form>

            <button className="close-btn" onClick={() => setOpenModal(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ================= ADD EMERGENCY MODAL ================= */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Emergency</h3>

            <form
              className="modal-form"
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                const location = JSON.parse(localStorage.getItem("location"));

                const newEmergency = {
                  id: Date.now(), // temporary id
                  type: formData.get("type"),
                  hospital: formData.get("hospital"),
                  detail: formData.get("detail"),
                  priority: formData.get("priority"),
                  time: "Just now",
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                };

                try {
                  await fetch("http://localhost:5001/api/auth/emergency", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newEmergency),
                  });

                  // ✅ instantly show in UI
                  setRequests((prev) => [newEmergency, ...prev]);

                  alert("✅ Emergency added!");
                  setAddModal(false);

                } catch (err) {
                  console.error(err);
                  alert("❌ Failed to add emergency");
                }
              }}
            >
              <select name="type" required>
                <option value="">Select Type</option>
                <option>Blood Needed</option>
                <option>Oxygen Supply</option>
                <option>Emergency Funds</option>
              </select>

              <input name="hospital" placeholder="Hospital / Location" required />
              <input name="detail" placeholder="Details (A+, cylinders, etc)" required />

              <select name="priority" required>
                <option value="">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <button type="submit" className="submit-btn">
                Add Emergency
              </button>
            </form>

            <button className="close-btn" onClick={() => setAddModal(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}