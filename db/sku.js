const mongoose = require("mongoose");
/*
category for the sku

category -> {
    gender -> male, female or unisex,
    type -> trouser, jeans, cap, etc.
    detail -> string
}
*/

const skuSchema = mongoose.Schema({
    name : {  // the name of the sku
        type : String,
        required : true
    },
    price : {  // the price
        type : Number,
        required : true
    },

    quantity : {  // the amount available in stock
        type : Number,
        required : true
    },
    category : {    // the categories the sku falls under...described above
        type :  Object,
        required : true
    },
    description : {    // the sku description
        type : String,
        required : true
    },
    sizes : {        // the range of sizes available
        type : [String],
        required : true
    },
    colors : {      // the available colors available
        type : [String],
        required : true
    },

    purchases : {   // the number of times the SKU has been purchased
        type : Number,
        default : 0
    },
    discount : {     // the discount on the sku
        type : Number,
        default : 0
    },

    review : {        // the review number of the sku
        type : Number,
        default : 0
    },

    trending : {     // is the sku trending ?
        type : Boolean,
        default : false
    }
})

const Sku = mongoose.model('Sku', skuSchema)

module.exports = {
    Sku
}