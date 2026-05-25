const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getBotResponse = async (message, Campaign) => {
  const msg = message.toLowerCase().trim();

  // 🔹 Greeting
  if (/hi|hello|hey/.test(msg)) {
    return {
      text: "Hello 👋 How can I assist you today?"
    };
  }

  // 🔹 Help → SHOW BUTTONS
  if (msg.includes("help")) {
    return {
      text: "What would you like to donate?",
      showOptions: true
    };
  }

  if (msg.includes("donate")) {
    return {
      text: "Choose what you want to donate 👇",
      showOptions: true
    };
  }

  if (msg.includes("food") || msg.includes("meal")) {
    const campaigns = await Campaign.findAll({ where: { category: "food" } });

    return {
      text: campaigns.length
        ? "🍲 Food Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
        : "No food campaigns found."
    };
  }

  if (msg.includes("health") || msg.includes("medical")) {
    const campaigns = await Campaign.findAll({ where: { category: "health" } });

    return {
      text: campaigns.length
        ? "🏥 Health Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
        : "No health campaigns found."
    };
  }

  // 🔹 Urgent campaigns
  if (msg.includes("urgent") || msg.includes("emergency")) {
    const campaigns = await Campaign.findAll({
      where: { urgent: true },
      limit: 5
    });

    return {
      text: campaigns.length
        ? "⚠️ Urgent Campaigns:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
        : "No urgent campaigns right now."
    };
  }

  // 🔹 Smart suggestion
  if (msg.includes("suggest") || msg.includes("recommend")) {
    const campaigns = await Campaign.findAll({ limit: 3 });

    return {
      text: campaigns.length
        ? "✨ Recommended for you:\n" + campaigns.map(c => `• ${c.title}`).join("\n")
        : "No campaigns available."
    };
  }


  // 🔹 About Website
if (msg.includes("about")) {
  return {
    text: "DonateCare is a platform that connects people to donate money, blood, or essential items and help those in need quickly and transparently."
  };
}

// 🔹 Contact Info
if (msg.includes("contact") || msg.includes("support") || msg.includes("reach")) {
  return {
    text: `
📞 You can contact DonateCare at:<br/><br/>

📧 Email: <a href="mailto:support@donatecare.com">support@donatecare.com</a><br/>
📱 Phone: +91 9876543210<br/><br/>

We're here to help you anytime!
    `
  };
}

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are DonateCare AI Assistant.

You help users with:
- Donations (money, blood, items)
- Emergency help
- Campaign discovery
- Platform guidance

Be short, helpful, and friendly.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return {
      text: aiResponse.choices[0].message.content
    };

  } catch (err) {
    console.error("AI Error:", err);
    return {
      text: "🤖 I didn’t understand that. Try asking about campaigns or donations."
    };
  }
};

module.exports = getBotResponse;