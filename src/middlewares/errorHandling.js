const AppError = require("../utils/AppError")
const mongoose = require('mongoose')
const logger = require('../utils/winstonLogger')


module.exports = {
    ErrorHandler: async (error, req, res, next) => {
       console.error(error)
        if (error instanceof AppError) {
            await mongoose.connection.close()
            
            logger.error(error.errorCode)
            return res.status(error.StatusCode).json({
                status: "failure",
                message: error.message,
                error_message: error.ErrorCode
            })
        }

        await mongoose.connection.close()
        return res.status(500).json({
            status: "failure",
            message: "Something went Wrong",
            error_message: error.ErrorCode
        })
    }
}

