const Lead = require("../models/Lead");
const { Op } = require("sequelize");

const getStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const totalLeads = await Lead.count({ where: { userId } });
    const dealsClosed = await Lead.count({ where: { userId, status: "Sale" } });
    const propertiesContacted = await Lead.count({ where: { userId, status: "Contact" } });
    const offersMade = await Lead.count({ where: { userId, status: "Offer" } });
    const activeListings = await Lead.count({ 
      where: { 
        userId,
        status: { [Op.in]: ["Lead", "Offer", "Contact"] } 
      } 
    });

    // Calculate percentage of deals closed
    const percentageDealsClosed = totalLeads > 0 
      ? ((dealsClosed / totalLeads) * 100).toFixed(2) 
      : "0.00";

    res.json({
      totalLeads,
      dealsClosed,
      propertiesContacted,
      offersMade,
      activeListings,
      percentageDealsClosed: percentageDealsClosed + "%"
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getStats
}; 