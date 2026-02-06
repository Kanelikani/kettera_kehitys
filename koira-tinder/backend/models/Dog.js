// backend/models/Dog.js

const mongoose = require("mongoose");

// GeoJSON Point (optionaalinen)
// coordinates on aina muodossa: [lng, lat]
const pointSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            // ei required -> voi puuttua
        },
        coordinates: {
            type: [Number],
            // ei required -> voi puuttua
        },
    },
    { _id: false },
);

const dogSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        breed: {
            type: String,
            trim: true,
        },
        age: {
            type: Number,
            min: 0,
        },
        bio: {
            type: String,
            trim: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        imageUrl: {
            type: String,
        },

        // Sijaintin voidaan täyttää myöhemmin kun otetaan GPS käyttöön
        // Pidetään default undefined, ettei Mongoose luo tyhjiä objekteja dokumentteihin.
        location: {
            type: pointSchema,
            default: undefined,
        },
    },
    { timestamps: true },
);

// Indeksi vasta sitten jos otetaan near haku käyttöön jääkö aikaa entii. t anssi (ja kun location-dataa oikeasti tallennetaan)
// dogSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Dog", dogSchema);
