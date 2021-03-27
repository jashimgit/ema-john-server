/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
// get env
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vewnd.mongodb.net/emajohndb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    const productsCollection = client.db('emajohndb').collection('products');
    const ordersCollection = client.db('emajohndb').collection('orders');
    // perform actions on the collection object
    // console.log('db connected');
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertMany(product);
        // console.log(product);
    });

    // get all products from collection
    app.get('/products', (req, res) => {
        productsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // get product by key
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key }).toArray((err, documents) => {
            res.send(documents[0]);
        });
    });

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            if (err) {
                console.log(err);
            }
            res.send(documents);
        });
    });
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });
});

// root path execution

app.get('/', (req, res) => {
    res.send('<h1>Server Running...........</h1>');
});

//  listen

app.listen(port, () => {
    console.log('server running...');
});
