const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gszam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client
      .db("practiceProducts")
      .collection("products");
    const orderCollection = client.db("practiceProducts").collection("orders");

    app.get("/products", async (req, res) => {
      const query = req.query;
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addproducts", async (req, res) => {
      const body = req.body;
      console.log(body);
      const insertAPd = body;
      const result = await productCollection.insertOne(insertAPd);
      console.log("successfully Added");
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/products/:updateId", async (req, res) => {
      const id = req.params.updateId;
      const body = req.body;
      console.log(body);
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          ...body,
        },
      };
      const result = await productCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post("/addorder", async (req, res) => {
      const body = req.body;
      console.log(body);
      const doc = {
        ...body,
      };
      const result = await orderCollection.insertOne(doc);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = req.query;
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
