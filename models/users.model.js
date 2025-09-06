const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    phonenumber: String,
    token: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String, 
        default: ""
    },
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;