// backend/server.js

// Tuodaan Node.js-kirjastot, express=palvelin, mongoose=tietokanta, cors=CORS-kirjasto, dotenv=ympäristömuuttujat
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    // credentials: true,  //Authorization-headerissa Bearer JWT:tä (ei cookies), credentials ei ole pakollinen.
}));
app.use(express.json());

// Reitit
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dogs", require("./routes/dogs"));
//app.use('/api/profiles', require('./routes/profiles'));
//app.use('/api/parks', require('./routes/parks'));

// MongoDB-yhteys 
const MongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB yhteys onnistui!");
    } catch (error) {
        console.error("❌ MongoDB yhteys epäonnistui:", error.message);
        process.exit(1);  // Lopeta prosessi kriittisessä virheessä
    }
};


// Käynnistä DB ensin, sitten serveri
MongoDB().then(() => {
    app.listen(5000, () => {
        console.log("Backend käynnissä: http://localhost:5000");
        console.log("Reitit: /api/auth, /api/dogs");
        console.log("CORS: http://localhost:5173");
    });
});