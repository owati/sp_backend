const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers.token
    if (!token) {
        res.status(401)
           .send({message : "a token is required for authentication"})
    } else {
        const decoded = jwt.decode(token, process.env.TOKEN_KEY)
        req.user = decoded
        return next()
    }
}