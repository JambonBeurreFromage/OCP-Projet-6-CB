const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')

// Charger les variables d'environnement depuis le fichier .env
dotenv.config()

////Importation des routes
const bookRoutes = require('./routes/book')
const userRoutes = require('./routes/user')

////Authentification mongoose
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

// Permet la communiation entre le serveur et le front ne partagant pas la même origine
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
)

// Utiliser Helmet pour sécuriser les en-têtes HTTP
app.use(
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' }
	})
)

// permet de lire les requêtes en json
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
