const express = require('express');

const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const { Category } = require('../db/admin')

const router = express.Router()

router.use(auth, admin)

router.route('/').all()
    .get( async (req, res) => {
        try {
            const category = await Category.find()
            if (category[0]) {
                res.status(200)
                   .send({
                       message : "successful",
                       data : category[0]
                   })
            } else {
                res.status(404)
                    .send({
                        message : "not found"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })

    .post(async (req, res) => {
        try {
            const category = await Category.find();

            if (category[0]) {
                res.status(403)
                    .send({
                        message : "only one category object can exist"
                    })
            } else {
                await Category.create({});
                res.status(201)
                   .send({
                       message : "object created successfully"
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
        /*
            the format for sending the data
            body -> {
                type : either "types" or "gender",
                value : "the value to be added",
            }
         */
        try {
            const {type, value} = req.body;
            if (type && value) {
                const category = await Category.find();
                category[0][type].push(value);
                
                await category[0].save();
                res.status(200)
                   .send({
                        message : "update handled successfully",
                        data : category[0]
                   })
            } else {
                res.status(400)
                   .send({
                       message : "cannot process request"
                   })
                }
                
        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
                })
        }
    })

    .delete(async (req, res) => {
        /*
        body -> {
            type = either "types" or "gender",
            value = "the value to be deleted"
        }
         */
        try {
            const {value, type} = req.body;
            const category = await Category.find()[0];
            if (value && type) {
                if (category[0][type].includes(value)) {
                    category[0][type].splice(
                        category[0][type].indexOf(value), 1
                        )
                        await category[0].save();
                    } else {
                        res.status(422)
                        .send({
                            message : "the value send does not exist"
                        })
                    }
                } else {
                    res.status(400)
                    .send({
                        message : "cannot process request"
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