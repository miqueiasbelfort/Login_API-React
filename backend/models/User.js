const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 20,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isReporter: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)