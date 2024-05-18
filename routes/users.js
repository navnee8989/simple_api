const router = require('express').Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeAccessDeniedError') {
      res.status(500).json({ error: 'Database connection error' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(400).json({ error: 'Password does not match' });
      return;
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeAccessDeniedError') {
      res.status(500).json({ error: 'Database connection error' });
    } else {
      res.status(500).json({ error: 'Login failed' });
    }
  }
});

module.exports = router;
