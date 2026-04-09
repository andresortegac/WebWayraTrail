const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function getLoginErrorResponse(error) {
  const knownDatabaseErrors = new Set([
    'ER_NO_SUCH_TABLE',
    'ER_BAD_FIELD_ERROR',
    'ER_BAD_NULL_ERROR',
    'ER_PARSE_ERROR',
  ]);

  if (knownDatabaseErrors.has(error?.code)) {
    return {
      status: 500,
      message: 'La tabla de usuarios no esta configurada correctamente en la base de datos.',
    };
  }

  return {
    status: 500,
    message: 'Server error',
  };
}

// Login
router.post('/login', async (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username : '';

  if (!db.pool) {
    return res.status(503).json({
      message: 'La base de datos aun se esta inicializando. Intenta nuevamente en unos minutos.',
    });
  }

  try {
    const { password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const [users] = await db.pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const storedPasswordHash = user.password_hash || user.password;

    if (!storedPasswordHash) {
      return res.status(500).json({ message: 'User password is not configured correctly' });
    }

    const isValidPassword = await bcrypt.compare(password, storedPasswordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: Number(user.id),
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    const response = getLoginErrorResponse(error);

    console.error('Login error:', {
      username,
      code: error.code || 'UNKNOWN',
      message: error.message,
    });
    res.status(response.status).json({ message: response.message });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      res.json({ valid: true, user: decoded });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
