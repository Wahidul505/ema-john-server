const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('John is running and waiting for Ema');
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1pr1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()
                console.log(products)
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products);
        });

        app.get('/productCount', async (req, res) => {
            const count = await productCollection.countDocuments();
            res.send({ count });
        });

        app.post('/productByKey', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            console.log(ids);
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally { }
}

run().catch(console.dir);


app.listen(port, () => console.log('John is running at,', port));
