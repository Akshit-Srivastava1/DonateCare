import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import "./Donate.css";

export default function Donate() {
  const [type, setType] = useState("money");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [item, setItem] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: ""
  });

  useEffect(() => {
    const selectedType = localStorage.getItem("donationType");
    if (selectedType) {
      setType(selectedType);
      localStorage.removeItem("donationType");
    }

    // 🔥 LOAD RAZORPAY SCRIPT
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= NORMAL DONATION =================
  const handleSubmit = async () => {
    setSuccess("");
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return setError("Please login first");
    if (!form.name || !form.email)
      return setError("Please fill all required fields");

    try {
      setLoading(true);

      await axios.post("http://localhost:5001/api/auth/donate", {
        userId: user.id,
        name: form.name,
        email: form.email,
        type,
        amount: type === "money" ? form.amount : null,
        bloodGroup,
        item,
        message: form.message
      });

      if (type === "blood") {
        setSuccess("🩸 Blood Donation Request Submitted!");
        alert("🩸 Blood request submitted successfully!");
      } else {
        setSuccess("🎁 Donation Submitted Successfully!");
        alert("🎁 Donation submitted successfully!");
      }

    } catch {
      setError("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= 🔥 RAZORPAY PAYMENT =================
  const handleCardPayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return setError("Please login first");
      if (!form.amount || Number(form.amount) < 1) {
      setError("Minimum amount is ₹1");
      return;
      }

      setLoading(true);

      // 1️⃣ CREATE ORDER
      const { data } = await axios.post(
        "http://localhost:5001/api/auth/create-order",
        { amount: Number(form.amount) }
      );

      const order = data.order;

      // 2️⃣ OPEN RAZORPAY
      const options = {
        key:import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SjoOhzJ7Eegrlr",
        amount: order.amount,
        currency: "INR",
        name: "DonateCare",
        description: "Donation Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ VERIFY PAYMENT
            await axios.post(
              "http://localhost:5001/api/auth/verify-payment",
              {
                ...response,
                formData: {
                  userId: user.id,
                  name: form.name,
                  email: form.email,
                  amount: form.amount,
                  message: form.message
                }
              }
            );

            setSuccess("💰 Payment Successful!");
            alert("✅ Payment Successful!");

          } catch {
            setError("Payment verification failed ❌");
          }
        },

        prefill: {
          name: form.name,
          email: form.email
        },

        theme: {
          color: "#4CAF50"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("❌ Payment Failed: " + response.error.description);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      setError("Payment failed ❌");
    } finally {
      setLoading(false);
      setShowCardModal(false);
    }
  };

  return (
    <div className="donate-container">
      <h1 className="title">Make a Donation</h1>
      <p className="subtitle">
        Choose what you want to donate and help someone in need.
      </p>

      <div className="donate-card">

        {/* LEFT */}
        <div className="donate-left">
          <h3>What would you like to donate?</h3>

          <div className={`option ${type === "money" ? "active" : ""}`} onClick={() => setType("money")}>
            💰 Money
          </div>

          <div className={`option ${type === "blood" ? "active" : ""}`} onClick={() => setType("blood")}>
            🩸 Blood
          </div>

          <div className={`option ${type === "other" ? "active" : ""}`} onClick={() => setType("other")}>
            🎁 Other
          </div>

          <div className="secure-box">🔒 100% Secure & Transparent</div>
        </div>

        {/* RIGHT */}
        <div className="donate-right">
          <h3>Donation Details</h3>

          {success && <div className="success-msg">{success}</div>}
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={(e) => e.preventDefault()}>

            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />

            {type === "money" && (
              <input type="number" name="amount" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} />
            )}

            {type === "blood" && (
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">Select Blood Group</option>
                <option>A+</option><option>A-</option>
                <option>O+</option><option>O-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            )}

            {type === "other" && (
              <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
            )}

            <textarea name="message" placeholder="Optional message" value={form.message} onChange={handleChange} />

            {/* 💳 PAYMENT */}
            {type === "money" && (
              <>
                <div className="payment-box">
                  <h4>Select Payment Method</h4>

                  <div className="payment-option" onClick={() => setShowCardModal(true)}>
                    💳 Pay via Card / Net Banking
                  </div>

                  <div className="payment-option">
                    📱 Scan QR (UPI)
                  </div>
                </div>

                {form.amount && (
                  <div className="qr-box">
                    <QRCode
                      value={`upi://pay?pa=vaibhav.shree9999@okaxis&pn=DonateCare&am=${form.amount}`}
                      size={150}
                    />
                  </div>
                )}
              </>
            )}

            {type !== "money" && (
              <button type="button" onClick={handleSubmit} className="donate-btn">
                ❤️ Donate Now
              </button>
            )}

          </form>

          {loading && <p>Processing payment...</p>}
        </div>
      </div>

      {/* 💳 MODAL */}
      {showCardModal && (
        <div className="modal-overlay">
          <div className="card-modal">
            <h3>💳 Proceed to Payment</h3>

            <button className="pay-btn" onClick={handleCardPayment}>
              Pay ₹{form.amount || 0}
            </button>

            <button className="close-btn" onClick={() => setShowCardModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
