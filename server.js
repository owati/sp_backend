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
    console.log(req.headers);
    next();
})

app.get('/', (req, res) => {
    console.log(req.headers);
    res.send({
        name : "John"
    })
})

//routes
app.use('/account', user_route);


app.listen("3000")