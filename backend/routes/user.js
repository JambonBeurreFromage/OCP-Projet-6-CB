const express = require('express')
const router = express.Router()

////Importation des controleurs
const userCtrl = require('../controllers/user')

router.post('/login', userCtrl.login)
router.post('/signup', userCtrl.signup)

module.exports = router
