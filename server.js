const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./src/config/database");
const userRoutes = require("./src/routes/userRoutes");
const leadRoutes = require("./src/routes/leadRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected...");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
