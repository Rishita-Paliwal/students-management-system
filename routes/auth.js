const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);

  const { username, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM faculty WHERE username = ?', [username]);

  if (rows.length === 0) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const user = rows[0];

  console.log("Entered Password:", password);
  console.log("Stored Hash:", user.password_hash);
  console.log("Hash length:", user.password_hash.length);

  let match = bcrypt.compareSync(password, user.password_hash);
  console.log("Compare result:", match);


  if (!match) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  req.session.user = { id: user.id, username: user.username };
  return res.json({ message: 'Login successful' });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
