const Book = require('../models/Book')
const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

exports.createBook = async (req, res, next) => {
	try {
		const bookObject = JSON.parse(req.body.book)
		delete bookObject._userId

		// Utiliser l'URL de l'image fournie par le middleware
		const book = new Book({
			...bookObject,
			userId: req.auth.userId,
			imageUrl: req.imageUrl
		})

		await book.save()
		res.status(201).json({ message: 'Livre enregistré' })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

// RATING (permet de noter un livre)
exports.ratingBook = async (req, res, next) => {
	const bookId = req.params.id
	const { userId, rating } = req.body

	if (rating < 0 || rating > 5) {
		return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' })
	}

	try {
		const book = await Book.findById(bookId)

		if (!book) {
			return res.status(404).json({ error: 'Livre non trouvé !' })
		}

		const ratingIndex = book.ratings.findIndex((rating) => rating.userId == req.auth.userId)

		if (ratingIndex !== -1) {
			return res.status(400).json({ error: 'Déjà noté' })
		} else {
			book.ratings.push({ userId, grade: rating })
		}

		const totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0)
		book.averageRating = totalRating / book.ratings.length
		book.averageRating = book.averageRating.toFixed(1)

		await book.save()
		res.status(200).json(book)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

////PUT
exports.majBook = async (req, res, next) => {
	try {
		const bookObject = req.file ? { ...JSON.parse(req.body.book) } : { ...req.body }
		delete bookObject.userId

		const book = await Book.findOne({ _id: req.params.id })
		if (!book) {
			return res.status(404).json({ message: 'Livre non trouvé' })
		}

		if (book.userId !== req.auth.userId) {
			return res.status(401).json({ message: 'Non autorisé' })
		}

		if (req.file) {
			// Suppression de l'ancienne image
			const oldFilename = book.imageUrl.split('/images/')[1]
			fs.unlink(`images/${oldFilename}`, (err) => {
				if (err) {
					console.log("Erreur de suppression de l'image: ", err)
				}
			})

			// Mettre à jour le chemin de l'image dans bookObject
			bookObject.imageUrl = req.imageUrl
		}

		await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
		res.status(200).json({ message: 'Livre modifié' })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

////DELETE
exports.removeBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				res.status(401).json({ message: 'Non auorisé' })
			} else {
				const filename = book.imageUrl.split('/images/')[1]
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: 'Livre supprimé' }))
						.catch((error) => res.status(401).json({ error }))
				})
			}
		})
		.catch((error) => {
			res.status(500).json({ error })
		})
}

////GET
exports.showAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }))
}

exports.showBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(404).json({ error }))
}

////Montre les 3 meilleurs livres
exports.bestBooks = (req, res, next) => {
	Book.find()
		.sort({ averageRating: -1 })
		.limit(3)
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }))
}
