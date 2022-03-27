const express = require('express');

const {Info} = require('../db/admin');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            let infos = await Info.find();
            res.status(200)
               .send({
                   message : "infos data fetched successfully",
                   data : infos
               })
        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }
    })
    .post(auth, admin, async (req, res) => {
        try {
            const body = req.body;
            await Info.create(body);
            res.status(201)
               .send({
                   message : "info created successfully",
               })
        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }
    });

router.route('/:id')
    .put(auth, admin, async (req, res) => {
        try {
            const body = req.body;
            let info = await Info.findById(req.params.id);
            info.details = body.details;
            await info.save();
            res.status(200)
               .send({
                   message : "info created successfully",
               })
        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }
    })
    .delete(auth, admin, async (req, res) => {
        try {
            let info = await Info.findById(req.params.id);
            await info.delete();
            res.status(200)
               .send({
                   message : "info deleted successfully",
               })
        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }
    })

module.exports = router;