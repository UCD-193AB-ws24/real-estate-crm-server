const User = require("../models/User");

const createOrUpdateUser = async (req, res) => {
  try {
    const { id, name, email, picture } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🔥 Received user:", req.body);

    // ✅ Check if a user already exists by email
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log("🔁 Existing user found by email:", user.toJSON());

      // Optional: update their UID if needed
      if (user.id !== id) {
        console.log("🛠 Updating user ID to match Firebase UID");
        user.id = id;
        await user.save();
      }
    } else {
      // ❌ No user with this email: create a new one
      user = await User.create({ id, name, email, picture });
      console.log("✅ New user created:", user.toJSON());
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrUpdateUser
}; 