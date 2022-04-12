const mongoose = require('mongoose');

const infoSchema = mongoose.Schema(
    {
        details: {
            type: String,
            required: true
        }
    }
)

const notifySchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }
})

const Info = mongoose.model('Info', infoSchema)
const Notify = mongoose.model('Notifys', notifySchema)


module.exports = {
    Info,
    Notify
}