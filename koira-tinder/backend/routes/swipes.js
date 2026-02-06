// backend/routes/swipes.js

const express = require("express");
const Swipe = require("../models/Swipe");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/swipes
router.post("/", auth, async (req, res) => {
    try {
        const { toDogId, action } = req.body;

        if (!toDogId) {
            return res.status(400).json({ error: "Missing toDogId" });
        }
        if (action !== "like" && action !== "pass") {
            return res.status(400).json({ error: "Invalid action" });
        }

        const swipe = await Swipe.create({
            fromUser: req.userId,
            toDog: toDogId,
            action,
        });

        return res.json(swipe);
    } catch {
        // Jos unique index estää tuplawipen, palautetaan siisti virhe
        return res.status(400).json({ error: "Already swiped" });
    }
});

module.exports = router;
