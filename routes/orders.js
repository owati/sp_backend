const e = require('express');
const express = require('express');
const { User, Order } = require('../db/user');
const admin = require('../middleware/admin')
const auth = require('../middleware/auth')

const STATUS_TYPES = [
    'placed', 'process', 'delivery', 'done'
]

const router = express.Router()

router.route('/user/')
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
            const query = req
            if (query?.id) {
                const order = await Order.findById(query?.id)

                if (order) {
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

            const order = await Order.create(body);

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