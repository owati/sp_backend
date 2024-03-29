const fs = require('fs')

const express = require('express');
const cloudinary = require('cloudinary')
const multer = require('multer');


const { Sku } = require('../db/sku');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Category } = require('../db/admin');
const storage = require('../upload');

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
                        data: sku
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

router.get('/units/some', async (req, res) => {
    try {
        const list =JSON.parse(req.query.list)
        const sku_list = []
        for(const id of list) {
            const sku = await Sku.findById(id);
            sku_list.push(sku)
        }

        res.status(200)
            .send({
                message : 'the skus fetched successful',
                data : sku_list
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
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
        const skus = await Sku.find();
        const category = await Category.findOne({ name: q });
        const filtered = [];
        if (category) {
            filtered.push(...skus.filter(
                sku => category.skus.includes(sku._id)
            ))
        } else {
            filtered.push(...skus.filter(
                sku => {
                    for(const tag of sku.tags) {
                        if (tag === q) return true
                    } return false
                }
            ))
            if (filtered.length == 0) {
                filtered.push(...skus.filter(
                    sku => sku.name.includes(q)
                ))
            }
        }

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
        const categories = await Category.find();
        const skus = await Sku.find();
        const suggestions = [];

        for (const sku of skus) {
            if (sku.name.toLowerCase().includes(q)) suggestions.push(sku.name)

            for (const tag of sku.tags) {
                if (tag.toLowerCase().includes(q)) suggestions.push(tag)
            }
        }

        for (const cat of categories) {
            if (cat.name.toLowerCase().includes(q)) suggestions.push(cat.name)
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
    .all(auth, admin,
        async (req, res, next) => {
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

        upload.array('image'))

    .post(async (req, res) => {
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
                    message: 'Added the images successfully..',
                    data: sku
                })

        } catch (e) {
            console.log(e.message)
            res.status(422)
                .send({
                    message: e.message
                })
        }

    })
    .put(async (req, res) => {
        const { files, params, body } = req;
        try {
            const positions = JSON.parse(Object.entries(body)[0][1]);
            const image_list = [];
            for (const image of files) {
                await cloudinary.v2.uploader.upload(
                    image.path,
                    callback = function (error, response) {
                        if (error) {
                            image_list.push('error')
                        } else {
                            image_list.push(response.url)
                        }

                        fs.unlinkSync(image.path) // removes the file
                    }
                )
            }

            const sku = await Sku.findById(params.id);
            positions.forEach((pos, index) => { // updates only the changed images
                sku.images[pos] = image_list[index]
            });

            await sku.save();

            res.status(200)
                .send({
                    message: 'The product was uploaded successfully'
                })
        } catch (e) {
            console.log(e.message)
            res.status(422)
                .send({
                    message: e.message
                })
        }
    }
)

router.get('/bestseller', async (req, res) => {
    try {
        const skus = await Sku.find();
        const best_seller = skus.sort(
            (a,b) => b.purchase_count - a.purchase_count
        )

        res.status(200)
            .send({
                message : 'The fetch was successful',
                data : best_seller.slice(0,10)
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            }
        )
    }
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



module.exports = router;