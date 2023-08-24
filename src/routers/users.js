const express = require('express')
const router = express.Router()
const Users = require('../controllers/users')
const { tryCatch } = require('../middlewares/tryCatch')
const { collectionValidation } = require('../middlewares/collectionValidation')
const  verifyToken  = require('../middlewares/tokenVerify')


router.route('/users/register')
    .post(tryCatch(Users.registerUser))

router.route('/users/login')
    .post(tryCatch(Users.loginUser))

router.route('/users/:id/cart')
    .post(verifyToken, collectionValidation, tryCatch(Users.addToCart))
    .delete(verifyToken, collectionValidation, tryCatch(Users.removeFromCart))

router.route('/users/:id/wishlist')
    .post(verifyToken, collectionValidation, tryCatch(Users.addToWishlist))
    .delete(verifyToken, collectionValidation, tryCatch(Users.removeFromWishlist))


module.exports = router