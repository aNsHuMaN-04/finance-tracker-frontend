const express = require('express');
const router = express.Router();
const {
  saveExpenseToSheet,
  getExpensesByEmail
} = require('../services/googleSheet');

router.post('/', async (req, res) => {
  try {
    const { email, amount, category, date, paymentMode, dayOfWeek } = req.body;

    if (!email || !amount || !category || !date || !paymentMode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await saveExpenseToSheet({
      email,
      amount,
      category,
      date,
      paymentMode,
      dayOfWeek
    });

    res.status(200).json({ message: 'Expense saved successfully' });
  } catch (error) {
    console.error('Error saving expense:', error.message);
    res.status(500).json({ message: 'Server error while saving expense' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const expenses = await getExpensesByEmail(email);
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

module.exports = router;
