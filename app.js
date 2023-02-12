const express = require('express');
const bodyParser = require('body-parser');

const medController = require('./controllers/medicine');

const app = express();

// let browser, page;
let socketId;
app.use((req, res, next) => {
    req.socketId = socketId;
    next();
})

app.use(bodyParser.json());

//add headers to every response to config if we allow CORS, methods that can access and header requirements
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // '*' means all domains are allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') //allow only these headers
    next();
})

app.get('/:searchTerm', medController.getMedInfo)

const server = app.listen(3000);
const io = require('./utils/socket').initIO(server);
io.on('connection', (socket) => {
    socketId = socket.id;
    console.log('client connected: ' + socketId);
})

// exports.browser = browser;
// exports.page = page;