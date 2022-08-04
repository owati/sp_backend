const express = require('express');
const {Sku, Review} = require('../db/sku');
const {User} = require('../db/user');

const router = express.Router();

router.post('/:skuid/:userid', async (req, res) => {
        try {
            const {skuid, userid} = req.params;

            const sku = await Sku.findById(skuid);
            const user = await User.findById(userid);

            if (sku && user) {

                const review_count = await Review.count({sku : skuid});
                console.log(review_count);
                
                const review = await Review.create({...req.body, sku : skuid, 
                                        user : user.first_name + ' ' + user.last_name});

                console.log(sku.ratings, review_count, review.rate)

                sku.ratings = (sku.ratings*review_count + review.rate) / (review_count + 1);

                await sku.save();

                res.status(201)
                    .send({
                        message : 'The review was created successfully'
                    })
            } else {
                res.status(404)
                    .send({
                        message : 'The sku or user was not found'
                    })
            }
        } catch (e) {
            res.status(400)
                .send({
                    message : e.message
                })
        }
    })


router.get('', async (req, res) => {
    try {
        const {id, sku} = req.query;

        if (id) {
            const review = await Review.findById(id);
            if (review) {
                res.status(200)
                    .send({
                        message : 'The fetch was successful',
                        data : review
                    })
            } else {
                res.status(404)
                    .send({
                        message : 'The review with the id was not successful'
                    })
            }
        } else {
            const reviews = await Review.find({sku : sku});

            const sku_obj = await Sku.findById(sku)
            res.status(200)
                .send({
                    message : 'The reviews was fetched successfully',
                    data : {reviews, name : sku_obj.name, rating : sku_obj.ratings}
                })
        }
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})


module.exports = router;