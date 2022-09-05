const mongoose = require('mongoose')

mongoose
	.connect('mongodb://localhost:27017/collaps', { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(e => {
		console.error('MongoDB connection error:', e.message)
	})

const db = mongoose.connection

module.exports = db
