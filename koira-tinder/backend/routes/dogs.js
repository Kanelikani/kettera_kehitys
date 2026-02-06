// backend/routes/dogs.js

const express = require("express");
const Dog = require("../models/Dog");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Luo tai päivitä oma koiraprofiili
/*
 POST /api/dogs/me MUISTIINPANO:
 * Frontend lähettää multipart/form-data -requestin:
 * "data" = JSON-string (sisältää name, breed, age, bio, visibility)
 * "image" = optional File (profiilikuva)
 * Kun mukana on tiedosto, request pitää olla multipart/form-data.
 * Multer parsii multipartin: tekstikentät -> req.body, tiedosto -> req.file
 */
router.post("/me", auth, upload.single("image"), async (req, res) => {
    try {
    // data-kenttä tulee multipartin mukana stringinä, parsi JSONiksi
        if (!req.body?.data) {
            return res.status(400).json({ error: 'Missing field "data" in form-data' });
        }

        let data;
        try {
            data = JSON.parse(req.body.data);
        } catch {
            return res.status(400).json({ error: 'Invalid JSON in field "data"' });
        }

        const { name, breed, age, bio, visibility } = data;

        // Jos kuva lähetettiin, muodostetaan URL (tiedosto on tallennettu uploads/ -kansioon)
        // Talletetaan DB:hen vain polku; frontend lisää API_BASEn eteen kun näyttää kuvan.

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Rakennetaan päivitettävät kentät. Jos imageUrl on null, älä ylikirjoita vanhaa kuvaa.
        const update = {
            name,
            breed,
            age: age === "" || age === null || age === undefined ? undefined : Number(age),
            bio,
            visibility,
        };

        if (imageUrl) {
            update.imageUrl = imageUrl;
        }

        // jos koiraa ei ole, luodaan; jos on, päivitetään.
        // owner tulee tokenista (auth middleware), ei frontendiltä.
        // Mongo/Mongoose: findOneAndUpdate(filter, updateDoc, options)
        const dog = await Dog.findOneAndUpdate(
        // 1. filter (hakuehto):
        // Etsi koiradokumentti, jonka owner == kirjautuneen käyttäjän id.
        // req.userId tulee auth-middlewaresta tokenin perusteella
            { owner: req.userId },

            // 2. updateDoc
            {
            // $set = päivitä nämä kentät joka kerta (sekä update että insert tapauksessa)
            // update-objekti sisältää esim. name/breed/age/bio/visibility (ja mahdollisesti imageUrl jos lähetettiin).
                $set: update,

                // $setOnInsert = aseta nämä kentät vain jos dokumentti joudutaan luomaan uutena (upsert insert)
                // Jos dokumentti jo löytyy, Mongo ignoraa tämän kokonaan.
                $setOnInsert: { owner: req.userId },
            },

            // 3) options
            {
            // Jos filterillä ei löydy dokumenttia, Mongo luo uuden (yhdistäen filter + updateDoc).
            // upsert: false (default) = “päivitä jos löytyy, muuten tee ei mitään”.
            // upsert: true = “päivitä jos löytyy, muuten luo uusi” (upsert).
                upsert: true,

                // new: true = palauta operaatioiden jälkeen se *uusi/päivitetty* dokumentti (ei vanhaa).
                new: true,
            },
        );

        return res.json(dog);
    } catch {

        return res.status(500).json({ error: "Server error saving dog profile" });
    }
});

// Hae kirjautuneen koira
router.get("/me", auth, async (req, res) => {
    try {
        const dog = await Dog.findOne({ owner: req.userId });
        if (!dog) return res.status(404).json({ error: "No dog profile yet" });
        return res.json(dog);
    } catch {
        return res.status(500).json({ error: "Server error retrieving dog profile" });
    }
});

module.exports = router;
