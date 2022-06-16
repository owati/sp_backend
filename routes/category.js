const express = require('express');

const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const { Category } = require('../db/admin');
const { Sku } = require('../db/sku');

const router = express.Router()

router.use(auth, admin)
router.route('/')
    .get(async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200)
                .send({
                    message: 'categories fetched successfully',
                    data: categories
                })
        } catch (e) {
            res.status(422)
                .send({
                    message: e.message
                })
        }

    })
    .post(async (req, res) => {
        const { body } = req;
        try {
            console.log(body)
            const category = await Category.create(body);
            res.status(201)
                .send({
                    message: 'category created successfully',
                    data: category
                })
        } catch (e) {
            res.status(422)
                .send({
                    message: e.message
                })
        }
    })


router.route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findById(id);
            if (category) res.status(200)
                .send({
                    message: 'category fetched successfully',
                    data: { category, skus: category.skus.map( async (id) => await Sku.findById(id)) }
                })
            else res.status(404)
                .send({
                    message: 'the entity not found'
                })
        } catch (e) {
            res.status(422)
                .send({
                    message: e.message
                })
        }
    })
    .put(async (req, res) => {
        const { id } = req.params;
        const { name, skus } = req.body
        try {
            const category = await Category.findById(id);
            if (category) {
                if (!name && !skus) {
                    res.status(422)
                        .send({
                            message: 'the data is not correct'
                        })
                } else {
                    if (name) category.name = name;
                    if (skus) category.skus = skus;

                    await category.save();

                    res.status(200)
                        .send({
                            message: 'product was updated successfully',
                            data: { category, skus: category.skus.map(async (id) => await Sku.findById(id)) },
                        })
                }

            } else {
                res.status(404)
                    .send({
                        message: 'The entity was not found'
                    })
            }

        } catch (e) {
            res.status(422)
                .send({
                    message: e.message
                })
        }
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        try {
            const category = await Category.findById(id);
            if (category) {
                await category.delete()
                res.status(200)
                    .send({
                        message : "the category has been deleted successfully",
                    })
            } else {
                res.status(404)
                    .send({
                        message : 'the entity was not found'
                    })
            }

        } catch (e) {
            res.status(422)
                .send({
                    message: e.message
                })
        }
    })

module.exports = router