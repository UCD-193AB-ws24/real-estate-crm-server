// src/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/status", chatController.getStatus);
router.post("/", chatController.chatWithGemini);

module.exports = router;