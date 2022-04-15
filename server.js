require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const user_route = require("./routes/user");
const sku_route = require('./routes/sku');
const info_route = require('./routes/info');
const notify_route = require('./routes/notify');
const category_route = require('./routes/category');


mongoose.connect('mongodb://localhost:27017/test')
const db_conn = mongoose.connection

db_conn.on('open', () => {
    console.log('connected')
})
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors({
    origin : ['http://localhost:3000']
}))

app.use((req, res, next) => {
    console.log(req.headers)
    next();
})


//routes
app.use('/account', user_route);
app.use('/sku', sku_route);
app.use('/info', info_route);
app.use('/notify', notify_route);
app.use('/category', category_route)

app.listen("3001")