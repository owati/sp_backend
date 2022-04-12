const express = require('express');


const { Sku } = require('../db/sku');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router()

router.route('/units')
    .get(async (req, res) => {
        try {
            const query = req.query;
            let qs;
            if (query) {
                qs = await Sku.find(query);
            } else {
                qs = await Sku.find();
            }
            res.status(200)
                .send({
                    message: "fetch successful",
                    data: qs
                })

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

    .post(auth, admin, async (req, res) => {
        try {
            const body = req.body
            if (body) {
                await Sku.create(body)
                res.status(201)
                    .send({
                        message: "new sku created"
                    })
            } else {
                res.status(400)
                    .send({
                        message: "no data was provided"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

router.route('/units/:id')
    .get(async (req, res) => {
        try {
            const sku = await Sku.findById(req.params.id);
            if (sku) {
                res.status(200)
                    .send({
                        message: "the sku entity was found",
                        data: sku
                    })
            } else {
                res.status(404)
                    .send({
                        message: "the sku entity was not found"
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .put(auth, admin, async (req, res) => {
        try {
            const sku = await Sku.findById(req.params.id);
            const body = req.body
            if (sku) {
                for (let i in body) {
                    console.log(i)
                    if (!(i === 'review')) {
                        sku[i] = body[i]
                    }
                }
                console.log("yeah")
                await sku.save()
                res.status(202)
                    .send({
                        message: "the update was successful"
                    })
            } else {
                res.status(404)
                    .send({
                        message: "the sku entity was not found"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })

        }
    })
    .delete(auth, admin, async (req, res) => {
        try {
            const sku = await Sku.findById(req.params.id);
            if (sku) {
                await sku.delete()
                res.status(200)
                    .send({
                        message: "the delete was successful"
                    })
            }
            else {
                res.status(404)
                    .send({
                        message: "the sku entity was not found"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })

        }
    })

router.get('/search', async (req, res) => {
    try {

        const { q } = req.query;
        const qs = await Sku.find()
        const filtered = qs.filter(
            ({ name, category }) => {
                if (name.includes(q)) {
                    return true;
                }
                else {
                    for(let i in category) {
                        if (category[i].includes(q)){
                            return true;
                        }
                    }
                    return false;
                }

            }
        )

        if (filtered.length > 0) {
            res.status(200)
                .send({
                    message: "filter results compiled",
                    data: filtered
                })
        } else {
            res.status(404)
                .send({
                    message: "the filter didn't match"
                })
        }

    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
})



module.exports = router;