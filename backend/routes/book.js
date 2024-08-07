const express = require('express')
const router = express.Router()
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')
const resizeImage = require('../middleware/resizeImage')

////Importation des controleurs
const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.showAllBooks)
router.get('/bestrating', bookCtrl.bestBooks)
router.get('/:id', bookCtrl.showBook)

router.post('/', auth, multer, resizeImage(500, 500), bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.ratingBook)

router.put('/:id', auth, multer, resizeImage(500, 500), bookCtrl.majBook)

router.delete('/:id', auth, bookCtrl.removeBook)

module.exports = router
