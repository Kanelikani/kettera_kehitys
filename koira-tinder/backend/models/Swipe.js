// backend/models/Swipe.js

const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toDog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dog",
            required: true,
        },
        action: {
            type: String,
            enum: ["like", "pass"],
            required: true,
        },
    },
    { timestamps: true },
);

// Estää tuplawipet samalle koiralle samalta userilta
swipeSchema.index({ fromUser: 1, toDog: 1 }, { unique: true });

module.exports = mongoose.model("Swipe", swipeSchema);
