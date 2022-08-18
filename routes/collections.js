const express = require('express');
const fs = require('fs')
const multer = require('multer');
const cloudinary = require('cloudinary');

const { Collections } = require('../db/admin')
const storage = require('../upload');
const { Sku } = require('../db/sku');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const e = require('express');

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
        upload.array('image'),
        async (req, res) => {
            try {
                const { body, files } = req;

                console.log(req, files, body)
                const collection = await Collections.create({ ...body });

                const image_list = [];
                for (let i = 0; i < files.length; i++) {
                    // console.log('runing for filr', path);
                    const { path } = files[i]
                    i !== 4 ? await cloudinary.v2.uploader.upload(
                        path,
                        callback = function (error, response) {
                            if (error) {
                                image_list.push('error')
                            } else {
                                image_list.push(response.url)
                            }
                            // try {
                            //     fs.unlinkSync(path)
                            // } catch (e) {

                            // }
                        }
                    ) : await cloudinary.v2.uploader.upload(path,
                        {
                            resource_type: "video",
                            // public_id: "myfolder/videos/",
                            chunk_size: 6000000,
                            eager: [
                                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
                            eager_async: true,
                            //eager_notification_url: "https://mysite.example.com/notify_endpoint"
                        },
                        function (error, response) { 
                            console.log('Hi just uploaded the video lest set', error, response)
                            if (error) {
                                image_list.push('error')
                            } else {
                                image_list.push(response.url)
                            }
                        });
                }

                console.log(image_list);

                collection.head_image = image_list[0]
                collection.sub_image_2 = [...image_list.slice(1, 4)]
                collection.sub_video_3 = image_list[4]
                collection.sub_image_4 = [...image_list.slice(5, 7)]
                collection.bottom_image = image_list[7]

                await collection.save()

                console.log('this is successful')
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
                        message: 'The collection was fetched successfully',
                        data: { collection, skus: sku_list }
                    })
            } else {
                res.status(404)
                    .send({
                        message: 'The collection was not found'
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

    .put(auth, admin,
        upload.array(),
        async (req, res) => {
            try {
                const { params, body, files } = req;

                const collection = await Collections.findById(params.id);

                if (collection) {
                    for (const [field, value] of Object.entries(body)) {
                        if (field !== 'positions') collection[field] = value;
                    }

                    if (files) {
                        const image_urls = []

                        const positions = JSON.parse(body.positions);

                        for (const { path } of files) {
                            cloudinary.v2.uploader.upload(
                                path,
                                callback = function (error, response) {
                                    if (error) {
                                        image_urls.push('error')
                                    } else {
                                        image_urls.push(response.url)
                                    }
                                }
                            )
                        }

                        for (const position of positions) {
                            const image_url = image_urls[positions.indexOf(position)]
                            const [name, pos] = position.split('--')
                            if (['sub_image_2', 'sub_images_4'].includes(name)) {
                                collection[name][pos] = image_url
                            } else collection[name] = image_url
                        }

                    }

                    await collection.save();

                    const sku_list = [];

                    for (const item of collection.sku_list) {
                        const sku = await Sku.findById(item);
                        sku_list.push(sku);
                    }

                    res.status(200)
                        .send({
                            message: 'Successfully updated the collection',
                            data: { collection, skus: sku_list }
                        })

                } else {
                    res.status(404)
                        .send({
                            message: 'The collection was not found'
                        })
                }

            } catch (e) {
                res.status(500)
                    .send({
                        message: e.message
                    })
            }
        })

module.exports = router