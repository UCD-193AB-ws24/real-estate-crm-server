const express = require('express');
const router = express.Router();
const { createOrUpdateUser, getUserIdByEmail } = require('../controllers/userController');

router.post('/', createOrUpdateUser);
router.get('/:email', getUserIdByEmail);

module.exports = router; 