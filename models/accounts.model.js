const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    fullname: String,
    role_id: String,
    email: String,
    password: String,
    phonenumber: String,
    token: {
        type: String,
        default: ""
    },
    avatar: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    }, 
    deletedAt: Date
}, {
    timestamps: true
});

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;