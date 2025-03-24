const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: {
        type: Date,
        index: { expires: 180 }
    }
}, {
    timestamps: true
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;