const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const dotenv = require('dotenv');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true });
const { v4 : uuidv4 }= require('uuid');

//serve static files
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');

//peer middleware
app.use('/peerjs', peerServer);

dotenv.config();

const PORT = process.env.PORT || 4000;

//routes
// root route
app.get('/', (req,res) =>{
    res.redirect(`/${uuidv4()}`)
})

//room id route
app.get('/:room', (req, res) =>{
    res.render('room', { roomId : req.params.room })
})

io.on('connection', socket =>{
    socket.on('join-room', (roomid, userId) =>{
        socket.join(roomid);
        socket.to(roomid).emit('user-connected', userId);
    })
})

server.listen(PORT, console.log(`Server running on port: ${PORT}`));