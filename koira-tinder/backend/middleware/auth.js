// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

// Middleware, joka varmistaa että käyttäjällä on voimassa oleva JWT-token
function auth(req, res, next) {
    // Otetaan Authorization-headerista pelkkä token
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");
    
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }


    try {
    // Tarkistetaan token ja puretaan siitä payload (mm. userId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({ error: "Token invalid or expired"});
    }
}

module.exports = auth;

