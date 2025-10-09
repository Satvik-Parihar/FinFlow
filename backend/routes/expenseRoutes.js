// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createExpense, getUserExpenses, uploadReceipt } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.route('/').post(protect, createExpense).get(protect, getUserExpenses);
router.post('/upload-receipt', protect, upload.single('receipt'), uploadReceipt);

module.exports = router;