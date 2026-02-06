// backend/routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Otetaan auth-middleware, joka tarkistaa JWT-tokenin
const auth = require("../middleware/auth");

// Rekisteröitymisreitti
router.post("/register", async (req, res) => {
    try {
        const { email, password, dogName, visibility } = req.body;
        // Mongoon uusi käyttäjä
        const user = new User({ email, password, dogName, visibility });
        await user.save();
        // Luodaan JWT-token, koska se helpottaa backendin kuormaa
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, email, dogName } });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(400).json({ error: err.message });
    }
});

// Kirjautumisreitti
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Mongosta haetaan käyttä ja tarkistetaan salasana
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Nyt on väärä passu tai käyttis" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user._id, email: user.email, dogName: user.dogName } });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(400).json({ error: err.message });
    }
});

// Palauta kirjautuneen käyttäjän tiedot
router.get("/me", auth, async (req, res) => {
    // '-password' = “älä sisällytä password-kenttää tulokseen”.
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// Päivitä kirjautuneen käyttäjän perustiedot (email, dogName, visibility)
// VAATII currentPassword (vahvistus) kaikkiin muutoksiin
router.put("/me", auth, async (req, res) => {
    try {
        const { email, dogName, visibility, currentPassword } = req.body;

        if (!currentPassword) {
            return res.status(400).json({ error: "currentPassword puuttuu" });
        }

        const user = await User.findById(req.userId); // sisältää password-hashin (nykyisessä schemassa)
        if (!user) return res.status(404).json({ error: "User not found" });

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) return res.status(401).json({ error: "Nykyinen salasana väärin" }); 

        // Päivitä vain jos annettu
        if (email !== null && email !== undefined) user.email = email;
        if (dogName !== null && dogName !== undefined) user.dogName = dogName;
        if (visibility !== null && visibility !== undefined) user.visibility = visibility;


        await user.save();

        const safeUser = await User.findById(req.userId).select("-password");
        return res.json(safeUser);
    } catch (err) {
    // Duplicate email => Mongo error code 11000
        if (err?.code === 11000) {
            return res.status(400).json({ error: "Email on jo käytössä" }); 
        }
        return res.status(400).json({ error: err.message });
    }
});


router.put("/me/password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Puuttuu currentPassword tai newPassword" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Uusi salasana liian lyhyt (min 6)" });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) return res.status(401).json({ error: "Nykyinen salasana väärin" });

        user.password = newPassword;
        await user.save(); // pre("save") hashää kun password muuttuu

        return res.json({ ok: true });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;
