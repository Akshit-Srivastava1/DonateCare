import { useState } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  const faqs = [
    {
      q: "What is DonateCare?",
      a: "DonateCare is a platform that connects donors, NGOs, and people in need for emergency help, blood donation, and financial support."
    },
    {
      q: "How does Nearby Activity work?",
      a: "It uses your location to show help requests, donors, and NGOs within a certain radius (like 100km)."
    },
    {
      q: "Is my donation secure?",
      a: "Yes, we aim to provide transparent and trackable donations to ensure your contribution reaches the right place."
    },
    {
      q: "How can I request help?",
      a: "Go to the Emergency section, click 'Help Now', fill the form, and submit your request."
    },
    {
      q: "Do I need to create an account?",
      a: "Yes, creating an account helps track your activity and ensures better coordination for help requests."
    }
  ];

  return (
    <div className="faq-page">

      {/* ===== HERO ===== */}
      <section className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about DonateCare.</p>
      </section>

      {/* ===== FAQ LIST ===== */}
      <section className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${active === index ? "active" : ""}`}
            onClick={() => toggle(index)}
          >
            <div className="faq-question">
              <h3>{item.q}</h3>
              <span>{active === index ? "−" : "+"}</span>
            </div>

            {active === index && (
              <p className="faq-answer">{item.a}</p>
            )}
          </div>
        ))}
      </section>

    </div>
  );
}