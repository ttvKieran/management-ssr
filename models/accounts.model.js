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
    refreshToken: {
        type: String, 
        default: ""
    },
    avatar: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    }, 
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;