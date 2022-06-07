const jwt = require("jsonwebtoken");
const { User } = require('../db/user')

module.exports = async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user?.user_id);
            if (user) {
                if (user.is_admin) return next();
                else {
                    res.status(403)
                        .send({
                            message: "the token is not authorized for this action"
                        })
                }
            } else {
                res.status(404)
                    .send({
                        message: "the user entity was not found"
                    })
            }
        } else {
            res.status(401)
                .send({
                    message : "the token is not valid"
                })
        }
    } catch (e) {
        res.status(400)
           .send({
               message : e.message
           })
    }
}