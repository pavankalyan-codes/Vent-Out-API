
const express = require('express')
const bodyParse = require('body-parser')

const cors=require('cors')

const PORT = process.env.PORT || 8080
const api=require('./routes/api')


const app=express()
var server = require('http').createServer(app);

global.io = require('socket.io')(server ,{
    cors: {
        origin: process.env.UI_URL,
        methods: ["GET", "POST"]
    }
})

io.on('connection', function(socket) {
    socket.on('disconnect', function () {
       console.log('A user disconnected--------------');
    });
 })



app.use(cors({
    origin: process.env.UI_URL,
  }));

app.use(bodyParse.json())

app.use('/api',api);
app.get('/', function(req,res){
    res.send("Hello from server")
})




server.listen(PORT, function(){
    console.log('Server running on localhost'+PORT);
    
})