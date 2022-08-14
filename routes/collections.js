const express = require('express');
const fs = require('fs')
const multer = require('multer');
const cloudinary = require('cloudinary');

const { Collections } = require('../db/admin')
const storage = require('../upload');
const { Sku } = require('../db/sku');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const collections = await Collections.find();

            res.status(200)
                .send({
                    message: 'The collections were collated successfully',
                    data: collections
                })
        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })


    .post(auth, admin,
        upload.array('images'),
        async (req, res) => {
            try {
                const { body, files } = req;

                const collection = await Collections.create({ ...body });

                const image_list = [];
                for (const { path } of files) {
                    await cloudinary.v2.uploader.upload(
                        path,
                        callback = function (error, response) {
                            if (error) {
                                image_list.push('error')
                            } else {
                                image_list.push(response.url)
                            }
                            fs.unlinkSync(path)
                        }
                    )
                }

                collection.head_image = image_list[0]
                collection.sub_image_2 = [...image_list.slice(1, 4)]
                collection.sub_video_3 = image_list[4]
                collection.sub_image_4 = [...image_list.slice(5, 7)]
                collection.bottom_image = image_list[7]

                await collection.save()

                // test response
                res.status(201)
                    .send({
                        message: 'The collections has been created successfully',
                        data: collection
                    })

            } catch (e) {
                res.status(400)
                    .send({
                        message: e.message
                    })
            }
        })


router.route('/:id')
    .get(async (req, res) => {
        try {
            const { id } = req.params;

            const collection = await Collections.findById(id);

            if (collection) {
                const sku_list = [];
    
                for (const item of collection.sku_list) {
                    const sku = await Sku.findById(item);
                    sku_list.push(sku);
                }
    
                res.status(200)
                    .send({
                        message : 'The collection was fetched successfully',
                        data : {collection , skus : sku_list}
                    })
            } else {
                res.status(404)
                    .send({
                        message : 'The collection was not found'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

    // .put(auth, admin, 
    //     upload.array()
    //     async(req, res) => {
    //     try {

    //     }
    // }) 

module.exports = router