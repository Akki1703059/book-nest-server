const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 1100;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://mern-book-store:Aakash%401234567@cluster0.jyeqzi8.mongodb.net/BookInventory?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri, {
    
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Define the collection
        const bookCollections = client.db("BookInventory").collection("Books");

        // API endpoints
        app.post("/upload-book", async (req, res) => {
            const data = req.body;
            const result = await bookCollections.insertOne(data);
            res.send(result);
        });

        app.get("/all-books", async (req, res) => {
            const result = await bookCollections.find().toArray();
            res.send(result);
        });

        app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            const updateBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updateBookData
                }
            };
            const options = { upsert: true };
            const result = await bookCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        });

        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.findOne(filter);
            res.send(result);
        });

        // Ping MongoDB deployment
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

run().catch(console.error);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
