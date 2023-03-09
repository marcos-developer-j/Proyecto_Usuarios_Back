const mongoose = require('mongoose');
const sessionSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Session', sessionSchema);