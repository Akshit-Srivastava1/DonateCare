const express = require('express');
const router = express.Router();

const { User, Campaign, Donation, HelpRequest, Emergency } = require('./models');
const { getPasswordHash, verifyPassword, createAccessToken } = require('./auth');
const getBotResponse = require('./chatbot');

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ================= EMERGENCY =================
router.post("/emergency", async (req, res) => {
  try {
    const { type, hospital, detail, priority, latitude, longitude } = req.body;
    if (!type || !hospital || !detail || !priority) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const emergency = await Emergency.create({ type, hospital, detail, priority, latitude, longitude });
    res.status(201).json({ success: true, emergency });
  } catch (err) {
    console.error("Emergency create error:", err);
    res.status(500).json({ success: false, message: "Failed to create emergency" });
  }
});

router.get("/emergency", async (req, res) => {
  try {
    const emergencies = await Emergency.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, emergencies });
  } catch (err) {
    console.error("Fetch emergency error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch emergencies" });
  }
});

router.get("/emergency/nearby", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const emergencies = await Emergency.findAll();
    const nearby = emergencies.filter(e => {
      if (!e.latitude || !e.longitude) return false;
      return getDistance(lat, lon, e.latitude, e.longitude) <= 10;
    });
    res.json({ success: true, emergencies: nearby });
  } catch (err) {
    console.error("Nearby error:", err);
    res.status(500).json({ success: false });
  }
});

// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await getPasswordHash(password);
    const newUser = await User.create({ name, email, password: hashedPassword, role: role || "donor" });
    const token = createAccessToken({ id: newUser.id.toString(), role: newUser.role });
    return res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id.toString(), name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false });
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return res.status(401).json({ success: false });
    const token = createAccessToken({ id: user.id.toString(), role: user.role });
    return res.json({
      success: true,
      token,
      user: { id: user.id.toString(), name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false });
  }
});

// ================= PROFILE =================
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    const donations = await Donation.findAll({ where: { userId } });
    const helps = await HelpRequest.findAll({
      where: userId ? { userId } : {}
    });
    res.json({ user, donations, helps });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching profile" });
  }
});

// ================= CHATBOT =================
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await getBotResponse(message, Campaign);
    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= DONATE =================
router.post('/donate', async (req, res) => {
  try {
    const { userId, name, email, type, amount, message, bloodGroup, item } = req.body;

    let finalAmount = null;
    let finalBloodGroup = null;
    let finalItem = null;

    if (type === "money") finalAmount = amount;
    if (type === "blood") finalBloodGroup = bloodGroup;
    if (type === "other") finalItem = item;

    const donation = await Donation.create({
      userId,
      name,
      email,
      type,
      amount: finalAmount,
      bloodGroup: finalBloodGroup,
      item: finalItem,
      message
    });

    return res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error("Donation error:", error);
    return res.status(500).json({ success: false, message: "Donation failed" });
  }
});

// ================= GET BLOOD DONORS =================
router.get("/blood-donors", async (req, res) => {
  try {
    const { group } = req.query;
    const where = group ? { bloodGroup: group } : {};
    const donors = await Donation.findAll({
      where: { type: "blood", ...where },
      order: [["createdAt", "DESC"]]
    });
    res.json({ donors });
  } catch (err) {
    console.error("Blood donors error:", err);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

// ================= GET ALL DONATIONS =================
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, donations });
  } catch (err) {
    console.error("Fetch donations error:", err);
    res.status(500).json({ success: false });
  }
});

// ================= CREATE ORDER =================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || Number(amount) < 1) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "donate_" + Date.now(),
    });
    res.json({ success: true, order });
  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ success: false });
  }
});

// ================= VERIFY PAYMENT =================
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const donation = await Donation.create({
      userId: formData.userId,
      name: formData.name,
      email: formData.email,
      type: "money",
      amount: order.amount / 100,
      message: formData.message
    });
    res.json({ success: true, donation });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
