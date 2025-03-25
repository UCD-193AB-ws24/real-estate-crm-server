const User = require("../models/User");

const createOrUpdateUser = async (req, res) => {
  try {
    const { id, name, email, picture } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🔥 Received user:", req.body);

    const userId = String(id);

    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({ id: userId, name, email, picture });
      console.log("✅ User created:", user.toJSON());
    } else {
      console.log("ℹ️ User already exists:", user.toJSON());
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrUpdateUser
}; 