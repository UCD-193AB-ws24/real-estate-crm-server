const Lead = require("../models/Lead");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Helper function to process images
const processImages = async (files) => {
  if (!files || files.length === 0) return [];
  
  return files.map(file => ({
    data: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    filename: file.originalname,
    mimetype: file.mimetype
  }));
};

const getLeadsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const leads = await Lead.findAll({
      where: { userId },
      attributes: ["name", "id", "address", "city", "state", "zip", "owner", "images", "status", "notes"],
    });

    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createLead = async (req, res) => {
  console.log("createLead");
  try {
    upload.array('images', 10)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.log("multer error");
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "Error processing images" });
      }

      try {
        const { name, address, city, state, zip, owner, status, notes, images, userId } = req.body;
        console.log("req.body", req.body);

        if (!address || !city || !state || !zip || !owner || !userId) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newLead = await Lead.create({ 
          name: name || null, 
          address, 
          city, 
          state, 
          zip, 
          owner, 
          images,
          notes,
          status: status || "Lead",
          userId
        });

        res.status(201).json(newLead);
      } catch (error) {
        console.error("Error adding lead:", error);
        res.status(500).json({ error: "Error adding lead" });
      }
    });
  } catch (error) {
    console.error("Error in createLead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateLead = async (req, res) => {
  try {
    upload.array('images', 10)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "Error processing images" });
      }

      try {
        const { id } = req.params;
        const { name, address, city, state, zip, owner, status, images } = req.body;

        const lead = await Lead.findByPk(id);
        if (!lead) {
          return res.status(404).json({ error: "Lead not found" });
        }

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (address !== undefined) fieldsToUpdate.address = address;
        if (city !== undefined) fieldsToUpdate.city = city;
        if (state !== undefined) fieldsToUpdate.state = state;
        if (zip !== undefined) fieldsToUpdate.zip = zip;
        if (owner !== undefined) fieldsToUpdate.owner = owner;
        if (status !== undefined) fieldsToUpdate.status = status;
        if (images !== undefined) fieldsToUpdate.images = lead.images ? [...images, ...lead.images].slice(0, 10) : images;

        await Lead.update(fieldsToUpdate, { where: { id } });
        const updatedLead = await Lead.findByPk(id);
        res.json(updatedLead);
      } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error in updateLead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.destroy({ where: { id } });

    if (deletedLead) {
      res.json({ message: "Lead deleted successfully" });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Error deleting lead" });
  }
};

module.exports = {
  getLeadsByUserId,
  createLead,
  updateLead,
  deleteLead
}; 