const express = require('express');

const { Discounts, Category } = require('../db/admin');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const { Sku } = require('../db/sku');
const { send } = require('express/lib/response');
const e = require('express');

const router = express.Router();

const DISCOUNT_APPLICATIONS = [
    'all', 'categories', 'collections', 'tags', 'products'
]

router.route('/')
    .all(auth, admin)
    .get(async (req, res) => {
        try {
            const discounts = await Discounts.find();
            res.status(200)
                .send({
                    message: 'The fetch was successful',
                    data: discounts
                })
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
            if (DISCOUNT_APPLICATIONS.includes(body.application.toLowerCase())) {
                const discount = await Discounts.create(body);
                res.status(201)
                    .send({
                        message: 'The discount was created successful'
                    })
            } else {
                res.status(422)
                    .send({
                        message: 'The application was not valid'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

router.route('/:id')
    .all(auth, admin)
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const discount = await Discounts.findById(id);
            let discount_copy;

            if (discount) {
                if (discount.application === 'products') {
                    const sku_list = [];
                    for (const id of discount.list) {
                        const sku = await Sku.findById(id);
                        sku_list.push(sku)
                    }
                    discount_copy = {
                        ...discount._doc,
                        list : sku_list
                    }
                }

                res.status(200)
                    .send({
                        message: 'The discount entity was found',
                        data: discount.application === 'products' ? discount_copy : discount
                    })
            } else {
                res.status(404)
                    .send({
                        message: 'The discount was not found'
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
            const { id } = req.params;
            const { body } = req;

            const discount = await Discounts.findById(id);

            if (discount) {
                for (const field in body) {
                    
                    if (field === 'application') {
                       
                        if (DISCOUNT_APPLICATIONS.includes(body[field])) {
                            discount.application = body[field]
                        }
                    } else {
                        discount[field] = body[field]
                    }
                }

                await discount.save()
                let discount_copy;
                if (discount.application === 'products') {
                    const sku_list = [];
                    for (const id of discount.list) {
                        const sku = await Sku.findById(id);
                        sku_list.push(sku)
                    }
                    discount_copy = {
                        ...discount._doc,
                        list : sku_list
                    }
                }

                res.status(200)
                    .send({
                        message: 'The discount entity was found',
                        data: discount.application === 'products' ? discount_copy : discount
                    })
            } else {
                res.status(404)
                    .send({
                        message: 'The products was not found'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .delete(async (req, res) => {
        try {
            const { id } = req.params
            const discount = await Discounts.findById(id);

            if (discount) {
                await discount.delete();
                res.status(200)
                    .send({
                        message: 'The discount was deleted successfully'
                    })
            } else {
                res.status(404)
                    .send({
                        message: 'The product was not found'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

router.post('/use', async (req , res ) => {
    try {
        const {code} = req.body
        const discount = await Discounts.findOne({code : code});
    
        if (discount) {
            const new_list = [];

            if (discount.application.type === 'products') {
                for(const id of discount.list) {
                    const sku = await Sku.findById(id);
                    new_list.push(sku);
                }
            } else if (discount.application.type === 'categories') {
                for (const category of discount.list) {
                    const category = await Category.find({name : category});
                    new_list.push(...category.sku);
                }
            }

            /**
             * Add other types later
             */

            res.status(200)
                .send({
                    message : 'The discount code is valid',
                    data : {
                        list : new_list,
                        value : discount.value,
                        fixed : discount.fixed,
                        is_all : discount.application === 'all'
                    }
                })
        }   else res.status(404)
                    .send({
                        message : 'The discount code is not found'
                    })
    } catch(e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})


module.exports = router