const multer = require('multer')

// const MIME_TYPES = {
// 	'image/jpg': 'jpg',
// 	'image/jpeg': 'jpg',
// 	'image/png': 'png'
// }

//Green code : utilisatin de memoryStroage  pour modifier depuis le controller la taille de l'image sans écriture sur le disque

const storage = multer.memoryStorage()

// const storage = multer.diskStorage({
// 	destination: (req, file, callback) => {
// 		callback(null, 'images')
// 	},
// 	filename: (req, file, callback) => {
// 		const name = file.originalname.split(' ').join('_')
// 		const extension = MIME_TYPES[file.mimetype]
// 		callback(null, name + Date.now() + '.' + extension)
// 	}
// })

module.exports = multer({ storage }).single('image')
