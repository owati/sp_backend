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
        console.log(e.message)
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
                const user = await User.findById(req.user?.user_id)

                if (user) {
                    for (let field in body) {
                        if (!["is_admin", "last_login", "date_created"].includes(field)) {
                            if (field === "password") {
                                const { old, new_pass } = body.password
                                console.log(old, user)
                                if (await bcrypt.compare(old, user.password)) {
                                    user.password = await bcrypt.hash(new_pass, 10)
                                } else {
                                    res.status(401)
                                        .send({
                                            message: "the old password is incorrect"
                                        })
                                    return
                                }
                            } else user[field] = body[field]
                        }
                    }
                    await user.save()
                    console.log(user, body)
                    res.status(202)
                        .send({
                            message: "user updated successfully",
                            userInfo: user
                        })
                } else {
                    res.status(404)
                        .send({
                            message: "user entity was not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "the token is invalid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
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
                            message: "user was deleted successfully"
                        })
                } else {
                    res.status(404)
                        .send({
                            message: "user entity was not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "the token is invalid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }

    })

router.route('/address')
    .get(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id)
                if (user) {
                    res.status(200)
                        .send({
                            message: "address data found",
                            data: user.address
                        })
                } else {
                    res.status(200)
                        .send({
                            message: "user entity not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "token is no longer valid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .post(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id);
                if (user) {
                    if (user.address.length < 3) {
                        const { address } = req.body
                        if (address && (
                            () => {
                                return Object.keys(address).includes('address') &&
                                    Object.keys(address).includes('phone')
                            }
                        )()) {
                            if (user.address.length === 0) address.default = true;
                            else address.default = false

                            if (!address.name) address.name = user.first_name + ' ' + user.last_name

                            user.address = [
                                ...user.address,
                                address
                            ]
                            await user.save();

                            res.status(201)
                                .send({
                                    message: "address added successfully",
                                    data: user.address
                                })
                        } else {
                            res.status(400)
                                .send({
                                    message: "data format not correct"
                                })
                        }
                    } else {
                        res.status(403)
                            .send({
                                message: "Only three adresses are allowed"
                            })
                    }
                } else {
                    res.status(404)
                        .send({
                            message: "user entity not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "token not valid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .put(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id);
                if (user) {
                    const { address, number } = req.body
                    if (user.address.length > number) {
                        if (address && (
                            () => {
                                return Object.keys(address).includes('address') &&
                                    Object.keys(address).includes('phone') && Object.keys(address).includes('name')
                            }
                        )()) {
                            user.address[number] = {
                                ...user.address[number],
                                ...address
                            }
                            await user.save();

                            res.status(200)
                                .send({
                                    message: "address updated successfully",
                                    data: user.address
                                })
                        } else {
                            res.status(400)
                                .send({
                                    message: "data format not correct"
                                })
                        }
                    } else {
                        res.status(400)
                            .send({
                                message: "the address number does not exist"
                            })
                    }
                } else {
                    res.status(404)
                        .send({
                            message: "user entity not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "token not valid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })
    .delete(auth, async (req, res) => {
        try {
            if (req.user) {
                const user = await User.findById(req.user?.user_id);
                if (user) {
                    const { number } = req.query;
                    if (user.address.length > number) {
                        const newAddresList = []
                        for (const address of user.address) {
                            if (user.address.indexOf(address) == number) {

                            } else {
                                newAddresList.push(address)
                            }
                        }

                        user.address = [
                            ...newAddresList
                        ]
                        await user.save();

                        res.status(200)
                            .send({
                                message: "address deleted successfully",
                                data: user.address
                            })
                    } else {
                        res.status(400)
                            .send({
                                message: "out of index"
                            })
                    }
                } else {
                    res.status(404)
                        .send({
                            message: "user entity not found"
                        })
                }
            } else {
                res.status(401)
                    .send({
                        message: "token not valid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    })

router.put('/address/default/:number', auth, async (req, res) => {
    try {
        const { number } = req.params
        if (req.user) {
            const user = await User.findById(req.user?.user_id);
            if (user) {
                if (user.address.length > number) {
                    for (let i = 0; i < user.address.length; i++) {
                        if (i == number) user.address[i].default = true
                        else user.address[i].default = false
                    }
                    await user.save();

                    res.status(200)
                        .send({
                            message: "default changed successfully",
                            data: user.address
                        })
                } else {
                    res.status(400)
                        .send({
                            message: "out of range"
                        })
                }
            } else {
                res.status(404)
                    .send({
                        message: "user entity not found"
                    })
            }
        } else {
            res.status(401)
                .send({
                    message: "token not valid"
                })

        }
    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
})

router.route('/cards').all(
    auth, async (req, res, next) => {
        try {
            if (req.user) next();
            else {
                res.status(401)
                    .send({
                        message: "the token is not valid"
                    })
            }

        } catch (e) {
            res.status(400)
                .send({
                    message: e.message
                })
        }
    }

).get(async (req, res) => {
    try {
        const user = await User.findById(req.user?.user_id)
        if (user) {
            res.status(200)
                .send({
                    message: "card data fetched successfully",
                    data: user.cards
                })
        } else {
            res.status(404)
                .send({
                    message: "the user entity is not found"
                })
        }
    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
}).post(async (req, res) => {
    try {
        const user = await User.findById(req.user?.user_id);
        const { card } = req.body
        if (user) {
            if (user.cards.length < 3) {
                if (card && (() => {
                    const key_list = Object.keys(card);
                    return key_list.includes('name') &&
                        key_list.includes('number') &&
                        key_list.includes('date') &&
                        key_list.includes('cvv')
                })()) {
                    user.cards.push(card)
                    await user.save()

                    res.status(201)
                        .send({
                            message: "the card was added successfully",
                            data: user.cards
                        })
                } else {
                    res.status(400)
                        .send({
                            message: "the data format is not correct"
                        })
                }
            } else {
                res.status(403)
                    .send({
                        message: "only three cards are allowed"
                    })
            }
        } else {
            res.status(404)
                .send({
                    message: "the user entity not found"
                })
        }

    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
}).put(async (req, res) => {
    try {
        const user = await User.findById(req.user?.user_id);
        const { card, number } = req.body
        if (user) {

            if (card && (() => {
                const key_list = Object.keys(card);
                return key_list.includes('name') &&
                    key_list.includes('number') &&
                    key_list.includes('date') &&
                    key_list.includes('cvv') &&
                    (number < user.cards.length)
                    && number >= 0
            })()) {
                user.cards[number] = card
                await user.save()

                res.status(201)
                    .send({
                        message: "the card was updated successfully",
                        data: user.cards
                    })
            } else {
                res.status(400)
                    .send({
                        message: "the data format is not correct"
                    })
            }

        } else {
            res.status(404)
                .send({
                    message: "the user entity not found"
                })
        }


    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
}).delete(async (req, res) => {
    try {
        const user = await User.findById(req.user?.user_id)
        if (user) {
            const { number } = req.query;
            if (number >= 0 && number < user.cards.length) {
                user.cards = user.cards.filter(
                    (card, index) => index != number
                )
                await user.save();
                res.status(200)
                    .send({
                        message: "the card deleted successfully",
                        data: user.cards
                    })
            } else {
                res.status(400)
                    .send({
                        message: "index was out of range"
                    })
            }
        }

    } catch (e) {
        res.status(400)
            .send({
                message: e.message
            })
    }
})

module.exports = router