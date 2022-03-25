const mongoose = require("mongoose");

const skuSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        amount : {
            type : Number
        },
        currency : {
            type : String
        }
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