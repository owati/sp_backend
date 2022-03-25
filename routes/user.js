const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router()

const { User, authenticate } = require('../db/user');
const auth = require('../middleware/auth');

router.post('/signup', async (req, res) => {    // for the signup
    const data = req.body;
    try {
        let oldUser = await User.findOne({ email: data.email });

        if (oldUser) {
            res.status(401)
                .send({ message: "this email already exists" });
        } else {
            await User.create({
                ...data,
                password: await bcrypt.hash(data.password, 10),
                date_created: new Date()
            })
            res.status(201)
                .send(
                    {
                        message: "the user has been created successfully"
                    }
                );
        }
    } catch (e) {
        console.log(e.message)
        res.status(400)
            .send(
                {
                    message: e.message
                }
            );
    }
});


router.post('/login', async (req, res) => {
    const data = req.body;
    try {
        let user = await authenticate(data.email, data.password);
        if (user) {
            res.status(user[0])
                .send(
                    {
                        message: user[1],
                        userInfo: user[2]

                    }
                );
        } else {
            res.status(401)
                .send(
                    {
                        message: "login was not successfull"
                    }
                );
        }
    } catch (e) {

    }
});

router.route('/info')
    .get(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id).select('-password')
                if (user) {
                    res.status(200)
                        .send(
                            {
                                message: "user entity found",
                                userInfo: user
                            }
                        )
                } else res.status(404)
                    .send(
                        {
                            message: "user entity not found",
                        }
                    )
            } else {
                res.status(401)
                    .send(
                        {
                            message: "token is no longer valid"
                        }
                    )
            }
        } catch (e) {
            res.status(400)
                .send(
                    {
                        message: e.message
                    }
                )
        }
    })
    .put(auth, async (req, res) => {
        const body = req.body
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id).select('-password')
                if (user) {
                    for (let field in body) {
                        if (!["is_admin", "last_login", "date_created"].includes(field)) {
                            if (field === "password") {
                                user.password = await bcrypt.hash(body.password, 10)
                            } else user[field] = body[field]
                        }
                    }
                    await user.save()
                    res.status(202)
                       .send({
                           message : "user updated successfully",
                           userInfo : user
                       })
                } else {
                    res.status(404)
                       .send({
                           message : "user entity was not found"
                       })
                }
            } else {
                res.status(401)
                   .send({
                       message : "the token is invalid"
                   })
            }

        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }
    })
    .delete(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id)
                if (user) {
                    user.delete()
                    res.status(202)
                       .send({
                           message : "user was deleted successfully"
                       })
                } else {
                    res.status(404)
                       .send({
                           message : "user entity was not found"
                       })
                }
            } else {
                res.status(401)
                   .send({
                       message : "the token is invalid"
                   })
            }

        } catch (e) {
            res.status(400)
               .send({
                   message : e.message
               })
        }

    })


module.exports = router