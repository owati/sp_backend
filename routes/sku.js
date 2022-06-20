const fs = require('fs')

const express = require('express');
const cloudinary = require('cloudinary')
const multer = require('multer');


const { Sku } = require('../db/sku');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Category } = require('../db/admin');
const storage = require('../upload');
const e = require('express');

const router = express.Router()


const upload = multer({ storage })

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
                const sku = await Sku.create(body)
                res.status(201)
                    .send({
                        message: "new sku created",
                        data : sku
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

router.get('/search/filter', async (req, res) => {
    try {

        const { q } = req.query;
        const qs = await Sku.find()
        const filtered = qs.filter(
            ({ name, category }) => {
                if (name.includes(q)) {
                    return true;
                }
                else {
                    for (let i in category) {
                        if (category[i].includes(q)) {
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

router.get('/search/suggest', async (req, res) => {
    try {
        const { q } = req.query;
        const category = await Category.find();
        const skus = await Sku.find();
        let suggestions = []

        for (let i of category[0].types) {
            if (i.includes(q)) {
                suggestions.push(i)
            }
        }

        for (let i of category[0].genders) {
            if (i.includes(q)) {
                suggestions.push(i);
            }
        }

        for (let i of skus) {
            if (i.name.includes(q)) {
                suggestions.push(i.name)
            }
        }
        if (suggestions.length == 0) {
            res.status(404)
                .send({
                    message: "nothing matched your search"
                })
        } else {
            shuffleArray(suggestions);

            res.status(200)
                .send({
                    message: "here are the suggestions",
                    data: suggestions.slice(0, 5)
                })
        }


    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
})

router.route('/image/:id')
    .all(auth, admin)
    .post(async (req, res, next) => {
        console.log(req.body)
        const { id } = req.params;
        try {
            const sku = await Sku.findById(id);
            if (sku) next();
            else res.status(404)
                .send({ message: 'the product with this id was not found' })
        } catch (e) {
            console.log(e.message)
            res.status(422)
                .send({ message: e.message })
        }
    },

        upload.array('image'),

        async (req, res) => {
            const { files, params } = req;

            const image_list = [];
            try {
                for (const file of files) {
                    console.log(file)
                    await cloudinary.v2.uploader.upload(
                        file.path,
                        callback = function (error, response) {
                            if (error) {
                                image_list.push('error')
                            } else {
                                image_list.push(response.url)
                            }

                            fs.unlinkSync(file.path) // removes the file
                        }
                    )
                }

                const sku = await Sku.findById(params.id);
                sku.images = image_list; await sku.save();

                res.status(201)
                    .send({
                        message : 'Added the images successfully..',
                        data : sku
                    })

            } catch (e) {
                console.log(e.message)
                res.status(422)
                    .send({
                        message: e.message
                    })
            }

        }) 


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



module.exports = router;