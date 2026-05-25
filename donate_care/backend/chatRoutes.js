const express = require("express");
const router = express.Router();
const getBotResponse = require("./chatbot");
const { Campaign } = require("./models");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await getBotResponse(message, Campaign);

    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;