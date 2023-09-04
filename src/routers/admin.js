const express = require('express')
const router = express.Router()
const Admin = require('../controllers/admin')
const {collectionValidation} = require('../middlewares/collectionValidation')
const {tryCatch} = require('../middlewares/tryCatch')

router.route('/create-dealer')
.post(tryCatch(Admin.registerDealer)) 

router.route('/test')
.get(tryCatch(Admin.test))

module.exports = router