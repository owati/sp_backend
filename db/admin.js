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
        type : String, // can be either all, categories, collections, products
        default : 'all'
    },
    list : {
        type : [String | Object],
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


const collections = mongoose.Schema({
    name : {
        type : String,
        required : true
    }, 
    headline : { 
        type : String,
        required : true
    },
    tags : {
        type : [String]
    },
    head_image : {  // url for the headimage
        type : String
    },
    sub_image_2 : {  // the url of the image carousel at the base (3 in number)
        type : [String]
    },

    sub_video_3 : { // the url of the video of the collection 
        type : String
    },
     
    sub_image_4 : { // the url of the base section image (2 in number)
        type : [String]
    },

    bottom_image : {
        type : String // the bottom image url
    },
    skus : {
        type : [String],
        default : []
    }
})

const Info = mongoose.model('Info', infoSchema)
const Notify = mongoose.model('Notifys', notifySchema)
const Category = mongoose.model("Category", category);
const Trending = mongoose.model('Trending', trending);
const NewReleases = mongoose.model('New Releases', newReleases);
const Discounts = mongoose.model('Discount', discounts);
const Collections = mongoose.model('Collection', collections)



module.exports = {
    Info,
    Notify,
    Category,
    Trending,
    NewReleases,
    Discounts, 
    Collections
}