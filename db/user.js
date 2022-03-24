const mongoose = require('mongoose');


const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        }
    }
)

const User = mongoose.model('User', userSchema);

module.exports = {
    User: User,
    authenticate: async (email, password) => {
        try {
            let user = await User.where('email')
                .equals(email).where('password')
                .equals(password).limit(1)
            return user[0]
        } catch (E) {
            return null
        }
    }
}