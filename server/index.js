// Le module « body-parser » permet de lire (parser) les données HTTP-POST
const bodyParser = require('body-parser'),
// ExpressJS nous permet de mettre en place un middleware pour répondre aux requêtes HTTP
express = require('express'),
app = express(),
http = require("http").createServer(app),
cors = require('cors');

const io = require('socket.io')(http, {
	cors: {
		origin: "http://localhost:8000" //http://localhost:8000 //https://collaps.netlify.app
	}
});

io.on('connection', socket => {
	const id = socket.handshake.query.id
	socket.join(id)

	 // recipients, channelId, sender, date, text, file
	socket.on('send-message', ({ recipients, channelId, sender, date, text, file }) => {
		recipients.forEach(recipient => {
			socket.broadcast.to(recipient.id).emit('receive-message', {
				channelId, sender, date, text, file
			})
		})
	})

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', id)
	})
})

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const userRouter = require('./routes/user-router')
const channelRouter = require('./routes/channel-router')
const fileRouter = require('./routes/file-router')

const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.use('/api', userRouter)
app.use('/api', channelRouter)
app.use('/api', fileRouter)

http.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
