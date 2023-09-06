const DealerDetails = require('../models/dealerDetails')
const User = require('../models/users')

const mongoose = require('mongoose')

module.exports = {
    registerDealer: async (req, res) => {
        const { name, password, email } = req.body

        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                status: 'failure',
                message: 'Invalid Password'
            })
        }

        await mongoose.connect(process.env.MONGODB_URL);

        const checkDealer = await DealerDetails.findOne({name})

        if (checkDealer) {
            return res.status(409).json({
                status: 'failure',
                message: 'User Already Exist'
            })
        }

        const createDealer = await DealerDetails.create({
            name
        })

        await mongoose.connection.close()

        const dealerApiKey = createDealer._id.toString()

        await mongoose.connect(`${process.env.MONGODB_URL}/ecom-${dealerApiKey}`)

        const createAnUser = await User.create({
            username: 'admin',
            password: dealerApiKey,
            email
        })

        await mongoose.connection.close()

        res.status(201).json({
            status: 'success',
            message: 'Successfully Created a Dealer',
            data: {
                apiKey: dealerApiKey
            }
        })
    },

    test: (req, res) => {
        res.json({
            status: 'Success',
            message: 'API tested Successfully!'
        })
    }
}