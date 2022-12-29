const express = require("express");
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("FataBook-running")
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldps5dz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db("FataBook").collection("post");
        const usersCollection = client.db("FataBook").collection("users");
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.post("/post", async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query);
            res.send(result);
        });
        app.put("/users/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email };
            options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        // app.put("/users/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const user = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             name: user.name,
        //             email: user.email,
        //             address:user.address,
        //             education:user.education
        //         }
        //     };
        //     const result = await usersCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);
        // });

        app.get("/post/:email", async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            console.log(query)
            const cursor = postCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.get("/post", async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query).limit(3);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            console.log(query)
            const cursor = usersCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
        });
        app.get("/all-post", async (req, res) => {
            const query = {};
            const users = await postCollection.find(query).toArray();
            res.send(users);
        });
    }
    finally {

    }
}
run().catch(console.log)

app.listen(port, () => console.log(`FataBook-running port ${port}`));