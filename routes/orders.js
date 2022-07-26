const e = require('express');
const express = require('express');
const { Sku } = require('../db/sku');
const { User, Order } = require('../db/user');
const admin = require('../middleware/admin')
const auth = require('../middleware/auth')

const STATUS_TYPES = [
    'placed', 'process', 'delivery', 'done'
]

const router = express.Router()

router.route('/user')
    .all(auth, (req, res, next) => {
        if (req?.user) next()
        else {
            res.status(401)
                .send({
                    message: 'The token is invalid'
                })
        }
    })
    .get(async (req, res) => {
        try {
            const {query} = req
            
            
            if (query?.id) {
                const order = await Order.findOne({id : query?.id})
                if (order) {
                    for (let i = 0; i < order.order_list.length; i++) {
                        const item = order.order_list[i]
                        const sku = await Sku.findById(item.id);
                        order.order_list[i].sku = sku
                    }

                    console
                    res.status(200)
                        .send({
                            message: 'The fetch was successful',
                            data: order
                        })
                } else {
                    res.status(404)
                        .send({
                            message: 'The data was not found'
                        })
                }
            }
            else {
                const orders = await Order.find({ user: req.user.user_id });
                res.status(200)
                    .send({
                        message: 'The fetch was successful',
                        data: orders
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .post(async (req, res) => {
        try {
            const { body } = req;

            // the logic to confirm the user payment

            const count = await Order.count();

            const id = (getCode(count))

            

            const order = await Order.create({...body, id});

            res.status(201)
                .send({
                    message: 'The Order was created successfully',
                    data: order
                })
        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })


router.get('/admin/', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200)
            .send({
                message: 'The fetch was successful',
                data: orders
            })
    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
})


router.route('/admin/:id')
    .all(auth, admin)
    .get(async (req, res) => {
        try {
            const { id } = req.params
            const order = await Order.findById(id);
            if (order) {
                res.status(200)
                    .send({
                        message: 'the fetch was successful',
                        data: order
                    })
            } else {
                res.status(404)
                    .send({
                        message: 'The order was not found'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

    .put(async (req, res) => {
        try {
            const {id} = req.params;
            const {status} = req.body

            const current_time = Date.now()
            const order = await Order.findById(id);

            if (order) {
                if (status) {
                    if (STATUS_TYPES.includes(status) && status !== 'placed') {

                        if(STATUS_TYPES.indexOf(status) === order.status.length) {

                            order.status.push({
                                status : status,
                                date : current_time
                            });

                            await order.save();

                            res.status(200)
                                .send({
                                    message : 'The status was updated successfully',
                                    data : order
                                })
                        } else {
                            res.status(422)
                                .send({
                                    message : 'The status sent is not in the right place'
                                })
                        }
                    } else {
                        res.status(422)
                            .send({
                                message : 'The status sent is invalid'
                            })
                    }
                }else {
                    res.status(422)
                        .send({
                            message : 'The data sent us invalid'
                        })
                }
                
            } else {
                res.status(404)
                    .send({
                        message : 'The order entity was not found'
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })


module.exports = router


function getCode(number) {
    let startString = ''
    for (let i  = 0; i < 4; i ++) {
        const rand = Math.floor(Math.random() * 26) + 65; // generates a number between 65 and 91
        startString += String.fromCharCode(rand);
    }
    const numLength = String(number).length;
    if ( numLength === 1) {
        return startString + '00' + number
    } else {
        return startString + '0' + number
    }
}