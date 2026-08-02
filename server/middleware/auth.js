const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'wayra_trail_secret_key_2024';

const normalizeUserRole = (role, fallback = 'user') => {
  const rawRole = typeof role === 'string' ? role.trim() : '';
  const rawFallback = typeof fallback === 'string' ? fallback.trim() : '';
  const normalizedRole = (rawRole || rawFallback).toLowerCase();

  if (!normalizedRole) {
    return 'user';
  }

  if (
    ['admin', 'administrator', 'superadmin', 'super-admin', 'root'].includes(normalizedRole)
  ) {
    return 'admin';
  }

  if (['user', 'usuario', 'member'].includes(normalizedRole)) {
    return 'user';
  }

  return normalizedRole;
};

const isAdminRole = (role, fallback = false) => {
  const normalizedRole = normalizeUserRole(role, fallback ? 'admin' : 'user');
  return normalizedRole === 'admin';
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!isAdminRole(req.user?.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, JWT_SECRET, normalizeUserRole, isAdminRole };
