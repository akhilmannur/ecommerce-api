const express = require('express')
const router = express.Router()
const Admin = require('../controllers/admin')
const {collectionValidation} = require('../middlewares/collectionValidation')
const {tryCatch} = require('../middlewares/tryCatch')

router.route('/create-dealer')
.post(tryCatch(Admin.registerDealer)) 

module.exports = router