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

        token : String
    }
)


const User = mongoose.model('User', userSchema);

async function generateToken (user) {
    // the token generation
}

module.exports = {
    User: User,

    authenticate: async (email, password) => {
        try {
            let user = await User.findOne({email});

            if (user && ( await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id : user._id, email},
                    process.env.TOKEN_KEY,
                    {expiresIn : '5h'}
                )
                user.token = token
                return [200, "login eas successful", user]
            } else {
                return [401,"the password is incorrect", null]
            }
        } catch (e) {
            console.log(e)
            return null
        }
    },
}