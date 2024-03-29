const express = require('express');

const {Trending, NewReleases} = require('../db/admin');
const {Sku} = require('../db/sku')
const admin = require('../middleware/admin');
const auth  = require('../middleware/auth')

const router = express.Router();

const router2 = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const trending = await Trending.findOne();
            if(trending) {
                const sku_list = [];

                for(const id of trending.skus) {
                    const sku = await Sku.findById(id);
                    sku_list.push(sku)
                }
                res.status(200)
                    .send({
                        message : 'The fetch is successful',
                        data : sku_list
                    })
            } else {
                res.status(400)
                    .send({
                        message : 'The trending was not found'
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })
    .post(auth, admin,
        async (req, res) => {
            try {
                const trending = await Trending.findOne();
                if (trending) {
                    res.status(422)
                        .send({
                            message : 'there can only be one category'
                        })
                } else {
                    await Trending.create({});
                    res.status(201)
                        .send({
                            message : 'the trending has been created'
                        })
                }
            } catch (e) {
                res.status(400)
                    .send({
                        message : e.message
                    })
            }
        })
    .put(auth, admin, async (req, res) => {
        try {
            const {skus} = req.body;
            const trending = await Trending.findOne();
            if(trending) {
                if (skus) {
                    trending.skus = skus;
                    await  trending.save();

                    const sku_list = [];
                    for(const id of trending.skus) {
                        const sku = await Sku.findById(id);
                        sku_list.push(sku);
                    }

                    res.status(200)
                        .send({
                            message : 'the update was successful',
                            data : sku_list
                        })
                }

            } else {
                res.status(400)
                    send({
                        message : 'There was an error fetching the trending'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })


router2.route('/')
    .get(async (req, res) => {
        try {
            const newReleases = await NewReleases.findOne();
            if(newReleases) {
                const sku_list = [];

                for(const id of newReleases.skus) {
                    const sku = await Sku.findById(id);
                    sku_list.push(sku)
                }
                res.status(200)
                    .send({
                        message : 'The fetch is successful',
                        data : sku_list
                    })
            } else {
                res.status(400)
                    .send({
                        message : 'The new releases was not found'
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })
    .post(auth, admin,
        async (req, res) => {
            try {
                const newReleases = await NewReleases.findOne();
                if (newReleases) {
                    res.status(422)
                        .send({
                            message : 'there can only be one new releases'
                        })
                } else {
                    await NewReleases.create({});
                    res.status(201)
                        .send({
                            message : 'the new releases has been created'
                        })
                }
            } catch (e) {
                res.status(400)
                    .send({
                        message : e.message
                    })
            }
        })
    .put(auth, admin, async (req, res) => {
        try {
            const {skus} = req.body;
            const newReleases = await NewReleases.findOne();
            if(newReleases) {
                if (skus) {
                    newReleases.skus = skus;
                    await  newReleases.save();

                    const sku_list = [];
                    for(const id of newReleases.skus) {
                        const sku = await Sku.findById(id);
                        sku_list.push(sku);
                    }

                    res.status(200)
                        .send({
                            message : 'the update was successful',
                            data : sku_list
                        })
                }

            } else {
                res.status(400)
                    send({
                        message : 'There was an error fetching the trending'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })



module.exports = {
    trending_routes : router,
    newReleases_routes : router2
}