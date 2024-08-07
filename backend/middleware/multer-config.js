const multer = require('multer')

//Green code : utilisatin de memoryStroage  pour modifier depuis le controller la taille de l'image sans écriture sur le disque

const storage = multer.memoryStorage()

module.exports = multer({ storage }).single('image')
