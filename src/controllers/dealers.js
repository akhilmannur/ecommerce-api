const ProductModel = require('../models/products')
const UserModel = require('../models/users')
const DealerModel = require('../models/dealerDetails')

const AppError = require('../utils/AppError')
const mongoose = require('mongoose')

const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");
const jwt = require('jsonwebtoken')

const fs = require('fs')

module.exports = {
    login: async (req, res) => {
        const {email, password } = req.body

        const Dealer = await DealerModel.findOne({email: email})
        
        if (!Dealer) {
            throw new AppError(`email or password Not Match.`, 'email or password Not Match.', 404)
        } 

        if(Dealer.password !== password) {
            throw new AppError("User Password doesn't match", "Password doesn't match", 401)
        }

        const dealerId = Dealer._id.toString() 
        
        const token = jwt.sign({ dealerId, username: Dealer.name, email: Dealer.email }, process.env.JWT_SECRET, { expiresIn: '3d' }) 

        res.status(200).json({ 
            status: 'success',
            message: 'User Logged In successfully',
            data: {
                token
            }
        })  
    },

    addProduct: async (req, res) => {

        const imageTitle = req.file?.filename
        const imagePath = req.file?.path

        const { title, price, description, category } = req.body

        const {dealerId} = req.user
        
        if (imagePath) {
            const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
            const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
            const region = process.env.S3_REGION;
            const Bucket = process.env.S3_BUCKET;

            // Create an S3 client instance
            const s3Client = new S3Client({
                region,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });

            const fileStream = require("fs").createReadStream(imagePath);

            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket,
                    Key: 'ecommerce-api-images/' + imageTitle, // The key (filename) you want to give to the uploaded file in S3
                    Body: fileStream, // The actual file stream
                },
            });

            const result = await upload.done()

            const addProduct = await ProductModel.create({ dealerId, title, description, price, category, image: result.Location })

            await fs.unlinkSync(imagePath);

            return res.status(201).json({
                status: 'success',
                message: 'Product Added successfully',
                data: addProduct
            })
        }

        const addProduct = await ProductModel.create({ dealerId, title, description, price, category })

        res.status(201).json({
            status: 'success',
            message: 'Product Added successfully',
            data: addProduct
        })
    },

    getAllProducts: async (req, res) => {
        const dealerId = req.body.dealerId
        const product = await ProductModel.find({dealerId})

        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched All Products',
            data: product
        })
    },

    getAProduct: async (req, res) => {

        const productId = req.params.id
        const dealerId = req.body.dealerId

        const fetchProduct = await ProductModel.find({ _id: productId, dealerId })

        if (fetchProduct.length === 0) {
            throw new AppError('Product Id Not Found in The Database', 'Product Not Found', 404)
        }

        const product = fetchProduct[0]

        res.json({
            status: 'success',
            message: 'Successfully Fetched Product',
            data: product
        })

    },

    updateAProduct: async (req, res) => {

        const {dealerId} = req.user

        const dataToUpdate = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category
        }

        const productId = req.params.id

        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: productId, dealerId },
            dataToUpdate,
            { new: true } // This option returns the updated document
        )

        if (!updatedProduct) {
            throw new AppError(`Product Id: ${productId} Not Found in The Database`, 'Product Not Found', 404)
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully Updated the Product',
            data: updatedProduct
        })
    },

    deleteAProduct: async (req, res) => {

        const productId = req.params.id

        const {dealerId} = req.user

        const product = await ProductModel.deleteOne({ _id: productId, dealerId })

        if (product.deletedCount === 0) {
            throw new AppError('Product Id Not Found in The Database', 'Product Not Found', 404)
        }

        res.json({
            status: 'success',
            message: 'Successfully Deleted the Product',
        })

    },

    findAllUsers: async (req, res) => {
        const {dealerId} = req.user
        
        const users = await UserModel.find({ dealerId }).select('-password')

        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched All Users',
            data: users
        })
    },

    findAUser: async (req, res) => {
        const {dealerId} = req.user
        const { id } = req.params

        const users = await UserModel.find({_id: id, dealerId}).select('-password')
        
        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched A User',
            data: users
        })
    },

    deleteAUser: async (req, res) => {

        const { id } = req.params
        const {dealerId} = req.user 

        const users = await UserModel.deleteOne({ _id: id, dealerId })


        if (users.deletedCount === 0) {
            throw new AppError(`User Id: ${id} Not Found in The Database`, 'User Not Found in Database', 404)
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully Deleted A User',
        })
    }

}