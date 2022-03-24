require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const user_route = require("./routes/user")

mongoose.connect('mongodb://localhost:27017/test')
const db_conn = mongoose.connection

db_conn.on('open', () => {
    console.log('connected')
})
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

app.use((req, res, next) => {
    next();
})


//routes
app.use('/account', user_route);


app.listen("3000")