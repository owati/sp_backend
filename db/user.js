const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            minLength: 2,
            maxLength: 30,
            required: true
        },
        last_name: {
            type: String,
            minLength: 2,
            maxLength: 30,
            required: true
        },
        email: {
            type: String,
            minLength: 5,
            maxLength: 50,
            required: true,
            index: {
                unique: true,
                dropDups: true
            }
        },

        birth_date : Date,
        phone_no : String,

        password: {
            type: String,
            required: true
        },

        address : {
            type : [Object],
            default : []
        },

        cards : {
            type : [Object],
            default : []
        },

        date_created : {
            type : Date,
            immutable : true
        },

        last_login : {
            type : Date
        },

        is_admin : {
            type : Boolean,
            default : false,
            immutable : true
        },

        token : String,

        favourites : {
            type : [String],
            default : []
        }
    }
)


const cart = mongoose.Schema({
    
    user : {
        type : String, // the id of the user
        required : true
    },
    sku_list : {
        type : [Object], // of the form {id : sku_id, data : {quantity : 0, size : s, color : #polas }}
        default : []
    }
})

const User = mongoose.model('User', userSchema);
const Cart = mongoose.model('Cart', cart)


module.exports = {
    User: User,
    Cart: Cart,
    authenticate: async (email, password) => {
        try {
            let user = await User.findOne({email});
            console.log(user)
            if (user && ( await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id : user._id, email},
                    process.env.TOKEN_KEY,
                    {expiresIn : '5h'}
                )
                user.token = token
                return [200, "login was successful", user]
            } else {
                return [401, `the ${!user ? "email" :"password"}  is incorrect`, null]
            }
        } catch (e) {
            console.log(e.message, 'pasas')
            return null
        }
    },
}