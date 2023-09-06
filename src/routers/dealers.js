const express = require('express')
const router = express.Router()
const Dealer = require('../controllers/dealers')
const { tryCatch } = require('../middlewares/tryCatch')
const { collectionValidation } = require('../middlewares/collectionValidation')
const  verifyToken  = require('../middlewares/tokenVerify')
const upload = require('../middlewares/multer')


router.route('/products')
    .post(upload.single('img'), collectionValidation, tryCatch(Dealer.addProduct))
    .get(collectionValidation, tryCatch(Dealer.getAllProducts))

router.route('/products/:id')
    .get(collectionValidation, tryCatch(Dealer.getAProduct))
    .patch(collectionValidation, tryCatch(Dealer.updateAProduct))
    .delete(collectionValidation, tryCatch(Dealer.deleteAProduct))

router.route('/users')
    .get(collectionValidation, tryCatch(Dealer.findAllUsers))

router.route('/users/:id')
    .get(collectionValidation, tryCatch(Dealer.findAUser))
    .delete(collectionValidation, tryCatch(Dealer.deleteAUser))

module.exports = router   