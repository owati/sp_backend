const express = require('express');
const { Sku } = require('../db/sku');
const {User, Order, authenticate} = require('../db/user');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(email && password) {
            const [status, message, user] = await authenticate(email, password);
            console.log(status, message, user)
            if (status === 401) {
                res.status(401)
                    .send({
                        message
                    })
            } else if(status === 200) {
                if (user.is_admin) {
                    res.status(200)
                        .send({
                            message,
                            user
                        })
                } else {
                    res.status(403)
                        .send({
                            message : 'you are not authorised'
                        })
                }
            }
        } else {
            res.status(422)
                .send({
                    message : 'the data format is not correct'
                })
        }


    } catch (e) {

    }
})

router.get('/info',auth,admin, async (req, res ) => {
    try {
        const user = await User.findById(req.user.user_id);
        res.status(200)
            .send({
                message : 'user info',
                data : user
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
}
)


router.get('/all/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find(); //is_admin : false
        res.status(200)
            .send({
                message : 'The users has been fetched successfully',
                data : users
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})

router.get('/user/:id', auth, admin, async (req, res) => {
    try {
    
        const user = await User.findById(req.params.id);
        if (user) {
            const orders = await  Order.find({user : user._id});
            const wishlist = []

            for (const item of user.favourites) {
                const sku = await Sku.findById(item)
                wishlist.push(sku)
            }

            res.status(200)
                .send({
                    message  : 'The user data was fetched successfully',
                    data : {
                        user,
                        orders,
                        wishlist
                    }
                })

        } else res.status(404).send({
            message : 'The user was not found'
        })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})


module.exports = router
