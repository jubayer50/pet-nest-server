const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // get database and create collection
    const database = client.db("petNest");
    const petCollection = database.collection("pets");

    // pet get method
    app.get("/pets", async (req, res) => {
      const cursor = petCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    // pet single get method
    app.get("/pets/:id", async (req, res) => {
      const { id } = req.params;

      const query = { _id: new ObjectId(id) };

      const result = await petCollection.findOne(query);

      res.send(result);
    });

    // pet post method
    app.post("/pets", async (req, res) => {
      const petData = req.body;

      const result = await petCollection.insertOne(petData);

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Word!");
});

app.listen(port, () => {
  console.log(`PetNest server is running on port ${port}`);
});
