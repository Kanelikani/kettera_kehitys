// backend/routes/dogs.js

const express = require("express");
const Dog = require("../models/Dog");
const auth = require("../middleware/auth");
const router = express.Router();

// Luo tai päivitä oma koiraprofiili
router.post("/me", auth, async (req, res) => {
    const { name, breed, age, bio, visibility, imageUrl } = req.body;

    let dog = await Dog.findOne({ owner: req.userId });
    if (!dog) {
        dog = new Dog({ owner: req.userId, name, breed, age, bio, visibility, imageUrl });
    } else {
        Object.assign(dog, { name, breed, age, bio, visibility, imageUrl });
    }
    await dog.save();
    res.json(dog);
});

// Hae kirjautuneen koira
router.get("/me", auth, async (req, res) => {
    const dog = await Dog.findOne({ owner: req.userId });
    if (!dog) return res.status(404).json({ error: "No dog profile yet" });
    res.json(dog);
});

module.exports = router;
