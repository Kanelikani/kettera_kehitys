// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// Middleware, joka varmistaa että käyttäjällä on voimassa oleva JWT-token
function auth(req, res, next) {
  // Haetaan Authorization-header (muodossa "Bearer TOKEN")
  const header = req.header('Authorization');

  if (!header) return res.status(401).json({ error: 'No token' });

  // Poistetaan "Bearer" ja jätetään pelkkä TOKEN
  const token = header.replace('Bearer ', '');

  try {
    // Tarkistetaan token ja puretaan siitä payload (mm. userId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (err) {

    return res.status(401).json({ error: 'Token invalid or expired' });
  }
}

module.exports = auth;
