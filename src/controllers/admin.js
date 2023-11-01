const DealerDetails = require('../models/dealerDetails')
const User = require('../models/users')
const { customAlphabet } = require('nanoid');

const mongoose = require('mongoose')

module.exports = {
    registerDealer: async (req, res) => {
        const { name, password, email, adminPassword } = req.body

        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                status: 'failure',
                message: 'Invalid Password'
            })
        }
        
        const checkDealer = await DealerDetails.findOne({email})
        
        if (checkDealer) {
            return res.status(409).json({
                status: 'failure',
                message: 'User Already Exist'
            })
        }
        
        const nanoid = customAlphabet('1234567890abcdef', 20)
        const accessKey = nanoid()

        const createDealer = await DealerDetails.create({
            name,
            email,
            password,
            accessKey
        })

        const dealerApiKey = createDealer?.accessKey

        res.status(201).json({
            status: 'success',
            message: 'Successfully Created a Dealer',
            data: {
                accessKey: dealerApiKey
            }
        })
    },

    test: (req, res) => {
        res.json({
            status: 'Success',
            message: 'API tested Successfully!'
        })
    },

    githubWebhook: (req, res) => {
        console.log(req.headers.X-Hub-Signature)
    }
}