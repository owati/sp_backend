const express = require('express');
const {User, authenticate} = require('../db/user');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(email && password) {
            const [status, message, user] = await authenticate(email, password);
            console.log(status, message, user)
            if (status === 401) {
                res.status(401)
                    .send({
                        message
                    })
            } else if(status === 200) {
                if (user.is_admin) {
                    res.status(200)
                        .send({
                            message,
                            user
                        })
                } else {
                    res.status(403)
                        .send({
                            message : 'you are not authorised'
                        })
                }
            }
        } else {
            res.status(422)
                .send({
                    message : 'the data format is not correct'
                })
        }


    } catch (e) {

    }
})

router.get('/info',auth,admin, async (req, res ) => {
    try {
        const user = await User.findById(req.user.user_id);
        res.status(200)
            .send({
                message : 'user info',
                data : user
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
}
)


module.exports = router
