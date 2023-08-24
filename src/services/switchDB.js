const mongoose = require('mongoose')

async function switchDB(apiKey) {
    try {
        mongoose.connect(`mongodb://127.0.0.1:/${apiKey}`)
    } catch (error) {
        res.status(400).json({
            status: 'failure',
            message: 'Failed to Connect to DB'
        })
    }
}

module.exports = switchDB