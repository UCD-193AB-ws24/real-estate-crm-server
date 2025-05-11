const User = require("../models/User");

const createOrUpdateUser = async (req, res) => {
  try {
    const { id, name, email, picture } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email field" });
    }

    console.log("🔥 Received user:", req.body);

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        id: id || `custom_${Date.now()}`, // fallback if no ID passed
        name: name || "Unnamed",
        email,
        picture,
      });
      console.log("✅ User created:", user.toJSON());
    } else {
      // Optionally update profile info (e.g., Google pic or name)
      await user.update({ name: name || user.name, picture: picture || user.picture });
      console.log("🔁 User updated:", user.toJSON());
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrUpdateUser,
};
