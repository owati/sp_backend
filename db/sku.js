const mongoose = require("mongoose");

const skuSchema = mongoose.Schema({
    name : {  // the name of the sku
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true // can be either male, female or unisex
    },
    categories : {
        type : [String],
        default : []
    },
    tags : {
        type : [String],
        default : [],
    },
    headline : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    images : {
        type : [String],
        default : []
    },
    sizes :{
        type : [String],
        default : []
    },
    colors : {
        type : [String],
        default : []
    },
    availability : {
        type : Boolean,
        default : true
    },
    quantity : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true,
    },
    ratings : {
        type : Number,
        default : 0
    },
    discount : {
        type : Number,
        required : true
    },
    date_created : {
        type : Date,
        default : Date.now
    },
    purchase_count : {
        type : Number,
        default : 0
    }
})

const reviewSchema = mongoose.Schema({
    sku : {
        type : String,
        required : true
    },
    user : {
        type : String,
        required : true
    },
    rate : {
        type : Number,
        required : true
    },
    headline : {
        type : String,
        required : true
    },
    details : {
        type : String
    },
    size : {
        type : String, // small, accurate, big
        required : true
    },
    comfort : {
        type : String, // Not Comfortable, Average, Very Comfortable
        required : true
    },
    durability : {
        type : String, // Not Durable, Average, Very Durable
        required : true
    },
    date_created : {
        type : String,
        default : Date.now
    }

})

const Sku = mongoose.model('Sku', skuSchema)
const Review = mongoose.model('Review', reviewSchema)

module.exports = {
    Sku,
    Review
}