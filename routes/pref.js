const express = require('express');
const {User, Cart} = require('../db/user');

const auth = require('../middleware/auth');

const router = express.Router()

router.route('/faves')
    .all(auth, (req, res, next )=> {
        if (req?.user) {
            next();
        } else {
            res.status(401)
                .send({
                    message : "this token is not authenticated "
                })
        }
    })
    .get(async (req, res) => {
        try {
            const {favourites} = await User.findById(req.user.user_id)

            res.status(200)
                .send({
                    message : 'fetch successful',
                    data : favourites
                })
        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })
    .put(async (req, res) => {
        try {
            const {faves} = req.body
            const user = await User.findById(req.user.user_id);
            if (faves){
                user.favourites = faves
                await user.save();
                res.status(200)
                    .send({
                        message : 'The faves have been updated',
                        data  : user.favourites
                    })
            } else {
                res.status(422)
                    .send({
                        message : 'The syntax is not correct'
                    })
            }
        } catch(e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })


router.route('/cart')
    .all(auth, (req, res, next )=> {
        if (req?.user) {
            next();
        } else {
            res.status(401)
                .send({
                    message : "this token is not authenticated "
                })
        }
    })
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.user.user_id)

            const cart = await Cart.findOne({user : user._id});

            if (cart) {
                res.status(200)
                    .send({
                        message : 'the cart was fetched successful',
                        data : cart.sku_list
                    })
            } else {
                const new_cart = await Cart.create({user : user._id});
                res.status(200)
                    .send({
                        message : 'The user had no cart, so a new cart was created',
                        data : new_cart.sku_list
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })
    .put(async (req, res) => {
        try {
            const {cart_data} = req.body;
            if (cart_data){
                const user = await User.findById(req.user.user_id)

                const cart = await Cart.findOne({user : user._id});
    
                if (cart) {
                    cart.sku_list = cart_data
                    await cart.save()
                    res.status(200)
                        .send({
                            message : 'the cart was updated successful',
                            data : cart.sku_list
                        })
                } else {
                    const new_cart = await Cart.create({user : user._id, sku_list : cart_data});
                    res.status(200)
                        .send({
                            message : 'The user had no cart, so a new cart was created',
                            data : new_cart.sku_list
                        })
                }
            } else {
                res.status(422)
                    .send({
                        message : 'The syntax is not correct'
                    })
            }
        } catch(e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })

module.exports = router;