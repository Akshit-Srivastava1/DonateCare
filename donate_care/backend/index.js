const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./database');
const authRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;


// ================= MIDDLEWARE =================
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));


// ================= ROOT =================
app.get('/', (req, res) => {
  res.json({ message: "DonateCare API is running 🚀" });
});


// ================= ROUTES =================
// All APIs:
// /api/auth/signup
// /api/auth/login
// /api/auth/chat
// /api/auth/donate
app.use('/api/auth', authRouter);


// ================= ERROR HANDLER (IMPORTANT) =================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});


// ================= SERVER START =================
async function startServer() {
  try {
    await sequelize.sync({ alter: true });

    console.log("✅ Database synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

startServer();