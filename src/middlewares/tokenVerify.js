const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const logger = require('../utils/winstonLogger')

const verifyToken = async (req, res, next) => {

    const header = req.header('Authorization')

    const token = header && header.split(' ')[1]
    
    if (!token) {
        logger.error('Token is not provided.')
        return res.status(401).json({
            status: 'failure',
            message: 'Token is not provided. Please provide a token.',
            error_message: 'Token is not provided.'
        })
    }

    try {
        const verified = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
       
        next()
    } catch (error) {
        logger.error(`Token Id: ${token} is not valid.`)
        return res.status(403).json({
            status: 'failure',
            message: 'Invalid Token',
            error_message: `Token Id: ${token} is not valid.`
        })   
    }
}

module.exports = verifyToken