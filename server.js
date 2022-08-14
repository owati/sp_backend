require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary');

// Routes imports
const admin_routes = require('./routes/admin')
const user_route = require("./routes/user");
const sku_route = require('./routes/sku');
const info_route = require('./routes/info');
const notify_route = require('./routes/notify');
const category_route = require('./routes/category');
const {trending_routes, newReleases_routes} = require('./routes/trending');
const discount_routes = require('./routes/discounts');
const pref_routes = require('./routes/pref')
const order_routes = require('./routes/orders')
const review_routes = require('./routes/reviews')
const collection_routes = require('./routes/collections')


// Cloudinary configuration
cloudinary.config({
    cloud_name: 'savage-phantom',
    api_key: '578972336692379',
    api_secret: 'Vkqk7kCduxpnQBl5MFN7lZMw5IQ',
    secure: true
})

// Mongoose configuration
mongoose.connect('mongodb://localhost:27017/test')
const db_conn = mongoose.connection

db_conn.on('open', () => {
    console.log('connected')
})


const app = express();

// Standard configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002']
}))

// app.use((req, res, next) => {
//     console.log(req.headers)
//     next();
// })


//routes
app.use('/account', user_route);
app.use('/sku', sku_route);
app.use('/info', info_route);
app.use('/notify', notify_route);
app.use('/category', category_route);
app.use('/admin', admin_routes);
app.use('/trending', trending_routes);
app.use('/newReleases', newReleases_routes);
app.use('/discount', discount_routes)
app.use('/pref', pref_routes)
app.use('/orders', order_routes)
app.use('/reviews', review_routes)
app.use('/collections', collection_routes)

app.listen("3001")