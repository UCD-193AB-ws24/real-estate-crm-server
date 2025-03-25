const express = require('express');
const router = express.Router();
const { 
  getLeadsByUserId, 
  createLead, 
  updateLead, 
  deleteLead 
} = require('../controllers/leadController');

router.get('/:userId', getLeadsByUserId);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router; 