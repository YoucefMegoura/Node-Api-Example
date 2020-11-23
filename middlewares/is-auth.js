const jwt = require('jsonwebtoken')

const { createErrorWithStatusCode } = require('../utils/errorHandling')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        createErrorWithStatusCode('Not authenticated.', 401)
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'secret')
    } catch( err ) {
        createErrorWithStatusCode(err, 500)
    }

    if (!decodedToken){
        createErrorWithStatusCode('Not autehticated.', 501)
    }

    req.userId = decodedToken.userId
    console.log('middle :: ', req.userId)
    next()
}