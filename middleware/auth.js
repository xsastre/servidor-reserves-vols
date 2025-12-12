/**
 * Middleware d'autenticació JWT
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clau_secreta_per_jwt_reserves_vols_2024';

/**
 * Middleware per verificar el token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accés requerit' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invàlid o expirat' });
    }
    req.user = user;
    next();
  });
};

/**
 * Funció per generar un token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
