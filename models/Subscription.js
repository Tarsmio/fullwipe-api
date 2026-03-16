const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
    endpoint: {
        type: String,
        unique: true,
        required: true
    },
    sub: {
        type: Object,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Subscription", subscriptionSchema, "subscription")