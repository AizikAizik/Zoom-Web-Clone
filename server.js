const express = require('express');
const dotenv = require('dotenv');
const { v4 : uuidv4 }= require('uuid');

const app = express();

//set view engine
app.set('view engine', 'ejs');

//serve static files
app.use(express.static('public'));

const server = require('http').Server(app);

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

//app.listen(PORT, console.log(`Server running on port: ${PORT}`));

server.listen(PORT, console.log(`Server running on port: ${PORT}`));