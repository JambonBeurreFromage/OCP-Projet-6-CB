const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

////Importation des controleurs
const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.showAllBooks)
router.get('/bestrating', bookCtrl.bestBooks)
router.get('/:id', bookCtrl.showBook)

router.post('/', auth, multer, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.ratingBook)

router.put('/:id', auth, multer, bookCtrl.majBook)

router.delete('/:id', auth, bookCtrl.removeBook)

module.exports = router
