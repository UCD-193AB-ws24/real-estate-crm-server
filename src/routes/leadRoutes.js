const express = require('express');
const router = express.Router();
const { 
  getLeadsByUserId, 
  createLead, 
  updateLead, 
  deleteLead 
} = require('../controllers/leadController');

router.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/email/:email', getLeadsByEmail);
router.post('/', createLead);
router.put('/:id', updateLead);
router.patch("/:id", updateLead);
router.delete('/:id', deleteLead);


module.exports = router;