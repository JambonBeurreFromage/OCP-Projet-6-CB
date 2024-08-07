const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
//// Middleware pour vérifier qu'un utilisateur est bien logé avec un token valide à l'appel de certaines routes

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
		const userId = decodedToken.userId
		req.auth = {
			userId: userId
		}
		next()
	} catch (error) {
		console.log('Problème authentification clé')
		res.status(401).json({ error })
	}
}
