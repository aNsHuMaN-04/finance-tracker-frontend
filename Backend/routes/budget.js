const express = require('express');
const router = express.Router();
const { saveBudgetToSheet, getBudgetsByEmail } = require('../services/googleSheet');

// Save a new budget
router.post('/', async (req, res) => {
  try {
    const { email, category, amount } = req.body;

    if (!email || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await saveBudgetToSheet({ email, category, amount });
    res.status(200).json({ message: 'Budget saved successfully' });
  } catch (error) {
    console.error('Error saving budget:', error.message);
    res.status(500).json({ message: 'Server error while saving budget' });
  }
});

// Get budgets by user
router.get('/user', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Missing email parameter' });

    const budgets = await getBudgetsByEmail(email);
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error.message);
    res.status(500).json({ message: 'Server error while retrieving budgets' });
  }
});

module.exports = router;
