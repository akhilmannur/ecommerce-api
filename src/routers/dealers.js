const express = require('express')
const router = express.Router()
const Dealer = require('../controllers/dealers')
const { tryCatch } = require('../middlewares/tryCatch')
const { collectionValidation } = require('../middlewares/collectionValidation')
const  verifyToken  = require('../middlewares/tokenVerify')
const upload = require('../middlewares/multer')

router.route('/login')
     .post(tryCatch(Dealer.login))

router.route('/products')
    .post(verifyToken, collectionValidation, upload.single('img'), tryCatch(Dealer.addProduct))
    .get(collectionValidation, tryCatch(Dealer.getAllProducts))

router.route('/products/:id')
    .get(collectionValidation, tryCatch(Dealer.getAProduct))
    .patch(verifyToken, collectionValidation, upload.single('img'), tryCatch(Dealer.updateAProduct))
    .delete(verifyToken, collectionValidation, tryCatch(Dealer.deleteAProduct))

router.route('/users')
    .get(verifyToken, collectionValidation, tryCatch(Dealer.findAllUsers)) 

router.route('/users/:id')
    .get(verifyToken, collectionValidation, tryCatch(Dealer.findAUser))
    .delete(verifyToken, collectionValidation, tryCatch(Dealer.deleteAUser))

module.exports = router   