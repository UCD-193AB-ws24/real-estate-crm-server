const Lead = require("../models/Lead");
const { Op } = require("sequelize");

const getStats = async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await Stat.findOne({ where: { userId: user.id } });

    if (!stats) {
      return res.status(200).json({
        totalLeads: 0,
        dealsClosed: 0,
        propertiesContacted: 0,
        offersMade: 0,
        activeListings: 0,
        percentageDealsClosed: "0.00%",
      });
    }

    res.status(200).json(stats);
  } catch (err) {
    console.error('❌ Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStats
}; 