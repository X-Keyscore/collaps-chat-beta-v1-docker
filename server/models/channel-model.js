const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messages = new Schema({
    senderId: { type: String, required: true },
    sendAt: { type: Date, required: true },
    contents: { type: String, required: true }
});

const Channel = new Schema(
    {
        id: { type: String, required: true },
        type: { type: String, required: true },
        recipients: { type: Array, required: true },
        messages: { type: Array, required: false }
    },
    { timestamps: true }
)

module.exports = mongoose.model('channels', Channel)