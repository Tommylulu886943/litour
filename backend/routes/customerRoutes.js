const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  listCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  sendEmailToCustomer
} = require('../controllers/customerController');

router.get('/', protect, admin, listCustomers);
router.post('/', protect, admin, createCustomer);
router.get('/:id', protect, admin, getCustomer);
router.put('/:id', protect, admin, updateCustomer);
router.delete('/:id', protect, admin, deleteCustomer);
router.post('/:id/email', protect, admin, sendEmailToCustomer);

module.exports = router;
