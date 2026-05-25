import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Message sent successfully ✅");

    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">

      {/* ===== HERO ===== */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          Have questions, feedback, or want to collaborate? We’d love to hear from you.
        </p>
      </section>

      {/* ===== CONTACT INFO ===== */}
      <section className="contact-info">
        <div className="info-card">
          <h3>📧 Email</h3>
          <p>support@donatecare.com</p>
        </div>

        <div className="info-card">
          <h3>📞 Phone</h3>
          <p>+91 98765 43210</p>
        </div>

        <div className="info-card">
          <h3>📍 Location</h3>
          <p>India</p>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section className="contact-form-section">
        <h2>Send a Message</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </section>

    </div>
  );
}