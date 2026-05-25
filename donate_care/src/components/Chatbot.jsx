import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false); 

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleDonateClick = (type) => {
    localStorage.setItem("donationType", type);
    navigate("/donate");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.toLowerCase();

    // 🚨 EMERGENCY REDIRECT
    if (userText.includes("emergency")) {
      setMessages(prev => [
        ...prev,
        { sender: "user", text: input },
        { sender: "bot", text: "🚨 Redirecting you to Emergency Help..." }
      ]);

      setInput("");

      setTimeout(() => {
        navigate("/emergency");
      }, 800);

      return;
    }

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    setInput("");

    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5001/api/auth/chat", {
        message: input
      });

      const reply = res.data.reply;

      setTimeout(() => {
        const botMsg = {
          sender: "bot",
          text: reply.text || reply,
          showOptions: reply.showOptions || false
        };

        setMessages(prev => [...prev, botMsg]);
        setTyping(false);
      }, 800);

    } catch {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Server error ❌" }
        ]);
        setTyping(false);
      }, 800);
    }
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chatbot-container">

          <div className="chatbot-header">
            DonateCare Assistant
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />

                {msg.showOptions && (
                  <div className="chat-options">
                    <button onClick={() => handleDonateClick("money")}>
                      💰 Donate Money
                    </button>
                    <button onClick={() => handleDonateClick("blood")}>
                      🩸 Donate Blood
                    </button>
                    <button onClick={() => handleDonateClick("other")}>
                      🎁 Donate Items
                    </button>
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="chatbot-message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage();
                }
              }}
              placeholder="Type a message and press Enter..."
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}