// middleware/auth.js
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;  // ← Tunnistaa userin!
    next();
  });
}
module.exports = auth;