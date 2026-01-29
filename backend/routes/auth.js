// backend/routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Otetaan auth-middleware, joka tarkistaa JWT-tokenin
const auth = require('../middleware/auth');

// Rekisteröitymisreitti
router.post('/register', async (req, res) => {
  try {
    const { email, password, dogName, visibility } = req.body;
    // Mongoon uusi käyttäjä
    const user = new User({ email, password, dogName, visibility });
    await user.save();
    // Luodaan JWT-token, koska se helpottaa backendin kuormaa
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email, dogName } });
  } catch (err) {
    console.error('REGISTER ERROR:', err);   // ← lisää
    res.status(400).json({ error: err.message });
  }
});

// Kirjautumisreitti
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Mongosta haetaan käyttä ja tarkistetaan salasana
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Nyt on väärä passu tai käyttis' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, dogName: user.dogName } });
  } catch (err) {
    console.error('LOGIN ERROR:', err);      // ← lisää
    res.status(400).json({ error: err.message });
  }
});

// Palauta kirjautuneen käyttäjän tiedot
router.get('/me', auth, async (req, res) => {
  // '-password' = “älä sisällytä password-kenttää tulokseen”.
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
