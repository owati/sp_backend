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
    taps : {
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
    discount : {
        type : Number,
        required : true
    },


})

const Sku = mongoose.model('Sku', skuSchema)

module.exports = {
    Sku
}