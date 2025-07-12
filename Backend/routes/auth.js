const express = require('express');
const router = express.Router();
const { addUserToSheet } = require('../services/googleSheet');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await addUserToSheet({ name, email, password });

    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
