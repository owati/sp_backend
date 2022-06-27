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

const discounts = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    code : {
        type : String,
        required : true,
    },
    fixed : {
        type : Boolean,
        default : true
    },
    value  : {
        type : Number,
        required : true
    },
    start_date : {
        type : Date
    },
    end_date : {
        type : Date,
    },
    application : {
        type : String, // can be either all, categories, collections, tags, products
        default : 'all'
    },
    list : {
        type : [String],
        default : []
    },
    active : {
        type : Boolean,
        default : true
    },
    use_count : {
        type : Number,
        default : 0
    }, 
    date_created : {
        type : Date,
        default : Date.now
    }
})

const Info = mongoose.model('Info', infoSchema)
const Notify = mongoose.model('Notifys', notifySchema)
const Category = mongoose.model("Category", category);
const Trending = mongoose.model('Trending', trending);
const NewReleases = mongoose.model('New Releases', newReleases);
const Discounts = mongoose.model('Discount', discounts);



module.exports = {
    Info,
    Notify,
    Category,
    Trending,
    NewReleases,
    Discounts
}