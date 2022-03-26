const mongoose = require("mongoose");

const skuSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },

    quantity : {
        type : Number,
        required : true
    },
    category : {
        type :  String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    sizes : {
        type : [String],
        required : true
    },
    colors : {
        type : [String],
        required : true
    },

    purchases : {
        type : Number,
        default : 0
    },
    discount : {
        type : Number,
        default : 0
    },

    review : {
        type : Number,
        default : 0
    },

    trending : {
        type : Boolean,
        default : false
    }
})

const Sku = mongoose.model('Sku', skuSchema)

module.exports = {
    Sku
}