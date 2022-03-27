const mongoose = require('mongoose');

const infoSchema = mongoose.Schema(
    {
        details : {
            type : String,
            required : true
        }
    }
)

const Info = mongoose.model('Info', infoSchema)


module.exports = {
    Info
}