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
    name : {
        type : String,
        required : true
    },
    skus : {
        type : [String],
        default : []
    }
})


const trending = mongoose.Schema({
    skus : {
        type : [String],
        default : []
    }
})

const newReleases = mongoose.Schema({
    skus : {
        type : [String],
        default : []
    }
})

const Info = mongoose.model('Info', infoSchema)
const Notify = mongoose.model('Notifys', notifySchema)
const Category = mongoose.model("Category", category);
const Trending = mongoose.model('Trending', trending);
const NewReleases = mongoose.model('New Releases', newReleases)



module.exports = {
    Info,
    Notify,
    Category,
    Trending,
    NewReleases
}