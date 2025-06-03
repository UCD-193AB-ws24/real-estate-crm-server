const User = require("../models/User");

const createOrUpdateUser = async (req, res) => {
  try {
    const { id: firebaseUid, name, email, picture } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🔥 Received user:", req.body);

    // ✅ Check if a user already exists by email
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log("🔁 Existing user found:", user.toJSON());

    } else {
      // 🆕 No user with this email, create new user
      user = await User.create({
        id: firebaseUid || `custom_${Date.now()}`, // Use Firebase UID or generate a unique ID
        name,
        email,
        picture,
      });

      console.log("✅ New user created:", user.toJSON());
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserIdByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    
    if (user) {
      return res.status(200).json({ userId: user.id });
    } else {
      return res.status(200).json({ userId: -1 });
    }
  } catch (error) {
    console.error("❌ Error finding user by email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrUpdateUser,
  getUserIdByEmail
};