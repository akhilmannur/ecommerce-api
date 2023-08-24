const ProductModel = require('../models/products')
const UserModel = require('../models/users')

const AppError = require('../utils/AppError')
const mongoose = require('mongoose')

const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");

const fs = require('fs')

module.exports = {
    addProduct: async (req, res) => {

        const imageTitle = req.file.filename
        const imagePath = req.file.path

        const { title, price, description, category } = req.body

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

            const addProduct = await ProductModel.create({ title, description, price, category, image: result.Location })

            await mongoose.connection.close()
            
            await fs.unlinkSync(imagePath);
            
            return res.status(201).json({
                status: 'success',
                message: 'Product Added successfully',
                data: addProduct
            })
        }
        
        const addProduct = await ProductModel.create({ title, description, price, category })


        await mongoose.connection.close()

        res.status(201).json({
            status: 'success',
            message: 'Product Added successfully',
            data: addProduct
        })
    },

    getAllProducts: async (req, res) => {

        const product = await ProductModel.find()

        if (!product) {
            throw new AppError('Products are empty in the Collection.', 'There are no products.', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched All Products',
            data: product
        })
    },

    getAProduct: async (req, res) => {

        const productId = req.params.id

        const product = await ProductModel.findById({ _id: productId })

        if (!product) {
            throw new AppError('Product Id Not Found in The Database', 'Product Not Found', 404)
        }

        await mongoose.connection.close()

        res.json({
            status: 'success',
            message: 'Successfully Fetched Product',
            data: product
        })

    },

    updateAProduct: async (req, res) => {

        const dataToUpdate = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category
        }

        const productId = req.params.id

        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: productId },
            dataToUpdate,
            { new: true } // This option returns the updated document
        )

        if (!updatedProduct) {
            throw new AppError('Product Id Not Found in The Database', 'Product Not Found', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Successfully Updated the Product',
            data: updatedProduct
        })
    },

    deleteAProduct: async (req, res) => {

        const productId = req.params.id

        const product = await ProductModel.deleteOne({ _id: productId })

        if (product.deletedCount === 0) {
            throw new AppError('Product Id Not Found in The Database', 'Product Not Found', 404)
        }

        await mongoose.connection.close()

        res.json({
            status: 'success',
            message: 'Successfully Deleted the Product',
        })

    },

    findAllUsers: async (req, res) => {

        const users = await UserModel.find({ ...req.query }).select('-password')

        if (!users) {
            throw new AppError('Users are empty in the Collection.', 'There are no users.', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched All Users',
            data: users
        })
    },

    findAUser: async (req, res) => {

        const { id } = req.params

        const users = await UserModel.findById(id).select('-password')

        if (!users) {
            throw new AppError('User Id Not Found in The Database', 'User Not Found', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Successfully Fetched A User',
            data: users
        })

    },

    deleteAUser: async (req, res) => {

        const { id } = req.params

        const users = await UserModel.deleteOne({ _id: id })


        if (users.deletedCount === 0) {
            throw new AppError('User Id Not Found in The Database', 'User Not Found', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Successfully Deleted A User',
        })
    }

}