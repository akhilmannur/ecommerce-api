const AppError = require('../utils/AppError')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/users')

module.exports = {

    registerUser: async (req, res) => {
        const { apiKey, username, email, password } = req.body

        const URL = process.env.MONGODB_URL

        await mongoose.connect(`${URL}/ecom-${apiKey}`);

        const User = await UserModel.find({ email })

        if (User.length > 0) {
            throw new AppError('User Already Exists', 'User Already Exists', 400)
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const AddUser = await UserModel.create({ username, email, password: hashedPass })

        await mongoose.connection.close()

        const token = jwt.sign({ username: User.username, email: User.email, apiKey }, process.env.JWT_SECRET, { expiresIn: '365d' })
        console.log('userId')
        const userId = AddUser._id.toString()

        res.status(201).json({
            status: 'success',
            message: 'User Added successfully',
            data: {
                userId,
                token
            }
        })

    },

    loginUser: async (req, res) => {

        const { apiKey, email, password } = req.body

        const URL = process.env.MONGODB_URL

        await mongoose.connect(`${URL}/ecom-${apiKey}`);

        const User = await UserModel.findOne({ email })

        if (!User) {
            throw new AppError('User Not Found', 'User Not Found', 404)
        }

        const comparePass = await bcrypt.compare(password, User.password)

        if (!comparePass) {
            throw new AppError('Invalid Credentials', 'Invalid Credentials', 400)
        }

        const token = jwt.sign({ username: User.username, email: User.email, apiKey }, process.env.JWT_SECRET, { expiresIn: '3d' })
    
        const userId = User._id.toString()
        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'User Logged In successfully',
            data: {
                userId,
                token
            }
        })

    },

    addToCart: async (req, res) => {

        const { productId } = req.params
        const { id } = req.params        
        const addToCart = await UserModel.updateOne({ _id: id }, { $addToSet: { cart: productId } })
        const da = await UserModel.findById(id)
        console.log(da)
        if (addToCart.modifiedCount === 0) {
            throw new AppError(`Product Already Exist`, 'Product already Exist!', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Product added to the cart successfully'
        })
    },

    viewItemsInCart: async (req, res) => {
        const { id } = req.params
        const products = await UserModel.findById(id).populate('cart').select('-username -password -email -wishlist -isAdmin -orders')
        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Cart items fetched successfully',
            data: {
                products
            }
        })

    },

    removeFromCart: async (req, res) => {

        const { productId } = req.params
        const { id } = req.params

        const removeFromCart = await UserModel.updateOne({ _id: id }, { $pull: { cart: productId } })

        if (removeFromCart.modifiedCount === 0) {
            throw new AppError(`Product Not Found`, 'Product Not Found!', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Product removed from the cart successfully'
        })
    },

    addToWishlist: async (req, res) => {
        const { productId } = req.params
        const { id } = req.params

        const addToWishlist = await UserModel.updateOne({ _id: id }, { $addToSet: { wishlist: productId } })

        if (addToWishlist.modifiedCount === 0) {
            throw new AppError(`Product already exist`, 'Product already exist!', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Product added to the wishlist successfully'
        })
    },

    viewItemsInWishlist: async (req, res) => {
        const { id } = req.params
        const products = await UserModel.findById(id).populate('wishlist').select('-username -password -email -cart -isAdmin -orders')
        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Wishlist items fetched successfully',
            data: {
                products
            }
        })

    },

    removeFromWishlist: async (req, res) => {

        const { productId } = req.params
        const { id } = req.params

        const removeFromWishlist = await UserModel.updateOne({ _id: id }, { $pull: { wishlist: productId } })
        
        if (removeFromWishlist.modifiedCount === 0) {
            throw new AppError(`Product already Removed from wishlist.`, 'Product Already removed from wishlist!', 404)
        }

        await mongoose.connection.close()

        res.status(200).json({
            status: 'success',
            message: 'Product removed from the wishlist successfully'
        })

    }

}

