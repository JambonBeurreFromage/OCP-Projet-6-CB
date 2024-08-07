const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

//Permet de redimenssionner avec des paramètres pour plus de fexibilité
const resizeImage = (width, height) => {
	return async (req, res, next) => {
		if (!req.file) {
			return next()
		}

		try {
			// Redimensionner l'image avec Sharp
			const imageBuffer = await sharp(req.file.buffer)
				.resize({
					width: width,
					height: height,
					fit: sharp.fit.inside,
					withoutEnlargement: true
				})
				.toFormat('jpeg')
				.jpeg({ quality: 80 })
				.toBuffer()

			// Créer un nom de fichier unique pour l'image
			const imageName = `${req.auth.userId}-${Date.now()}.jpg`
			const filePath = path.join('images', imageName)

			// Enregistrer l'image redimensionnée sur le disque
			fs.writeFileSync(filePath, imageBuffer)

			// Ajouter l'URL de l'image à la requête pour l'utiliser dans les contrôleurs
			req.imageUrl = `${req.protocol}://${req.get('host')}/images/${imageName}`
			req.imageName = imageName

			next()
		} catch (error) {
			res.status(500).json({ error: "Erreur lors du traitement de l'image" })
		}
	}
}

module.exports = resizeImage
