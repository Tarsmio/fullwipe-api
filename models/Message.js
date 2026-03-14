const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creation: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("Message", messageSchema, "message")