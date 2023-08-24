const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    const header = req.header('Authorization')

    const token = header && header.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            status: 'failure',
            message: 'Token is not provided'
        })
    }

    try {
        const verified = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (error) {
        return res.status(403).json({
            status: 'failure',
            message: 'Invalid Token'
        })
    }
}

module.exports = verifyToken