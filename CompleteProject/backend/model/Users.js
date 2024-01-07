const mongoose = require("mongoose")

const Users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [80, "name can't exceed 80 characters"]
    },
    email: {
        type: String,
        required: true,
        maxLength: [100, "email can't exceed 500 characters"]
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    hobbies: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Users', Users, 'Tableinfo')