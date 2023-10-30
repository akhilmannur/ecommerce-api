const express = require('express')
const router = express.Router()
const Dealer = require('../controllers/dealers')
const { tryCatch } = require('../middlewares/tryCatch')
const { accessKeyCheck } = require('../middlewares/accessKeyCheck')
const  verifyToken  = require('../middlewares/tokenVerify')
const upload = require('../middlewares/multer')

router.route('/login')
     .post(tryCatch(Dealer.login))

router.route('/products')
    .post(verifyToken, upload.single('img'), tryCatch(Dealer.addProduct))
    .get(accessKeyCheck, tryCatch(Dealer.getAllProducts))

router.route('/products/:id')
    .get(accessKeyCheck, tryCatch(Dealer.getAProduct))
    .patch(verifyToken, upload.single('img'), tryCatch(Dealer.updateAProduct))
    .delete(verifyToken, tryCatch(Dealer.deleteAProduct))

router.route('/users')
    .get(verifyToken, tryCatch(Dealer.findAllUsers)) 

router.route('/users/:id')
    .get(verifyToken, tryCatch(Dealer.findAUser))
    .delete(verifyToken, tryCatch(Dealer.deleteAUser))

module.exports = router   