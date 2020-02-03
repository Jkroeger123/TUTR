const express = require(`express`);
const bodyParser = require(`body-parser`);
const app = express();
const userModel = require('./database/userModel.js');
const userRoutes = require('./routes/user.js');
const mongoose = require('mongoose');
const session = require('express-session');

//database connection

mongoose.set('useCreateIndex', true) //this is just to remove a deprecation warning

mongoose.connect("mongodb+srv://jkroeger:hello@cluster0-1uuit.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser : true})
    .then(() => console.log('DB connected...'))
    .catch(err => console.log('DB connection error...'));

//routes
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());//incoming data to json format

app.use(express.static(__dirname));

app.use(session({secret:"123", resave:false, saveUninitialized:true}))

app.use('/user', userRoutes());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//start server
const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server opened on port ${PORT}`);
})