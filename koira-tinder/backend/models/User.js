// backend/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dogName: String,
    visibility: { type: String, enum: ["public", "private"], default: "public" },
});

// Salasanan hashaus ennen tallennusta
userSchema.pre("save", async function () {
    // jos salasanaa ei ole muutettu, ei hashata uudelleen
    if (!this.isModified("password") && !this.$isNew) return;

    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);