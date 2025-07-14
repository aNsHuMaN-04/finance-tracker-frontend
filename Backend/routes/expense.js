const express = require('express');
const router = express.Router();
const { saveExpenseToSheet } = require('../services/googleSheet');

router.post('/', async (req, res) => {
  try {
    const { email, amount, category, date, paymentMode, dayOfWeek } = req.body;

    if (!email || !amount || !category || !date || !paymentMode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await saveExpenseToSheet({ email, amount, category, date, paymentMode, dayOfWeek });

    res.status(200).json({ message: 'Expense saved successfully' });
  } catch (error) {
    console.error('Error saving expense:', error.message);
    res.status(500).json({ message: 'Server error while saving expense' });
  }
});

module.exports = router;

