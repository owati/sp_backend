const express = require('express');
const router = express.Router()

const {User , authenticate} = require('../db/user')

router.post('/signup', async (req, res) => {    // for the signup
    const data = req.body;

    try {
        let user = await User.create(data)
        if (user) {
            res.status(201)
                .send(
                    {
                        message : "the user has been created successfully"
                    }
                )
        } else {
            res.status(400)
               .send(
                   {
                       message : "the sent data is not correct"
                   }
               )
        }
    } catch (e) {
        console.log(e.message)
        res.status(500)
           .send(
               {
                   message : "there is an internal server error"
               }
           )

    }
})


router.post('/login', async (req, res) => {
    const data = req.body;

    try {
        let user = await authenticate(data.email, data.password);
        if(user) {
            res.status(200)
               .send(
                   {
                       message : "login was successfull",
                       user_info : user
                   }
               )
        } else {
            res.status(401)
               .send(
                   {
                        message : "login was not successfull"
                   }
               )
        }

    } catch (e) {

    }
})


module.exports = router