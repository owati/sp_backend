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

const category = mongoose.Schema({
    types : {
        type : [String],
    },
    genders : {
        type : [String],
        default : ["male", "female"]
    }
})

const Info = mongoose.model('Info', infoSchema)
const Notify = mongoose.model('Notifys', notifySchema)
const Category = mongoose.model("Category", category)


module.exports = {
    Info,
    Notify,
    Category
}