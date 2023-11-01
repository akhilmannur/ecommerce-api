const express = require('express')
const router = express.Router()
const Admin = require('../controllers/admin.js')
const {tryCatch} = require('../middlewares/tryCatch')

router.route('/create-dealer')
.post(tryCatch(Admin.registerDealer)) 

router.route('/test')
.get(tryCatch(Admin.test))

router.route('/github-webhook')
.post(tryCatch(Admin.githubWebhook))

module.exports = router