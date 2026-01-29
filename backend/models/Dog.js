// backend/models/Dog.js
const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  breed: String,
  age: Number,
  bio: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Dog', dogSchema);
