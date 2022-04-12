const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const { Notify } = require('../db/admin');
const { send } = require('express/lib/response');

const router = express.Router()

router.route('/')
    .get(auth, admin, async (req, res) => {
        try {
            const notifyme = await Notify.find()

            res.status(200)
                .send({
                    message : "fetch was successful",
                    data : notifyme
                })
        } catch(e) {
            res.status(500)
                .send({
                    message : e.message
                })
        }
    })
    .post(async (req, res) => {
        try {
            const {email} = req.body
            if (email) {
                await Notify.create({
                    email : email
                })
                res.status(201)
                    .send({
                        message : "the email has been added"
                    })
            } else {
                res.status(400)
                    .send({
                        message : "the body does not contain an email key"
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