// backend/server.js

// Tuodaan Node.js-kirjastot, express=palvelin, mongoose=tietokanta, cors=CORS-kirjasto, dotenv=ympäristömuuttujat
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));  // Frontend-portti
app.use(express.json());

// Reitit
app.use('/api/auth', require('./routes/auth'));
//app.use('/api/profiles', require('./routes/profiles'));
//app.use('/api/parks', require('./routes/parks'));

mongoose.connect(process.env.MONGO_URI);
app.listen(5000, () => console.log('Backend: http://localhost:5000'));
