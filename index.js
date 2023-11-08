const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.socuaah.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const topFoodsCollection = client.db("restaurantDB").collection("topFoods");
    const allFoodItemsCollection = client.db("restaurantDB").collection("allFoodItems");
    const purchaseFoodCollection = client.db("restaurantDB").collection("purchaseFood");
    const addFoodItemFoodCollection = client.db("restaurantDB").collection("addFoodItem");




    // TopFoodsCollection:
    app.get('/topFoods', async(req,res)=>{
        const cursor = topFoodsCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })


    //--------------------------------------------------------
    //pagination
    // AllFoodItemsCollection
    app.get('/allFoodItems', async(req,res)=>{
      // const query = req.query;

      let query = {}
      if(req.query?.email){
        query={email:req.query.email}
      }

      //....pore dekhbo
      const page = query.page
      const pageNumber = parseInt(page);
      const perPage = 9;
      const skip = pageNumber * perPage
      const cursor = allFoodItemsCollection.find().skip(skip).limit(perPage);
      const result = await cursor.toArray()
      const postCount = await allFoodItemsCollection.countDocuments()
      res.json({result,postCount})
  })










//---------------------------------------------------------------------
  app.get("/allFoodItems/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await allFoodItemsCollection.findOne(query);
    console.log(result);
    res.send(result);
  });


  app.get("/foodPurchase/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await allFoodItemsCollection.findOne(query);
    console.log(result);
    res.send(result);
  });





  // purchaseFoodCollection:

  app.post("/purchaseFood", async (req, res) => {
    const purchase = req.body;
    console.log(purchase);
    const result = await purchaseFoodCollection.insertOne(purchase);
    res.send(result);
  });




  //My Profile
  // addFoodItemFoodCollection
 
    app.get('/addFoodItem', async(req,res)=>{
      let query = {}
      if(req.query?.email){
        query={email:req.query.email}
      }
      const cursor = addFoodItemFoodCollection.find();
      const result = await cursor.toArray()
      res.send(result)
  })

  app.post("/addFoodItem", async (req, res) => {
    const addNewFood = req.body;
    const result = await addFoodItemFoodCollection.insertOne(addNewFood)
    res.send(result);
  })


  app.get("/addFoodItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addFoodItemFoodCollection.findOne(query);
      res.send(result);
    });


    app.put("/addFoodItem/:id", async (req, res) => {
      const id = req.params.id;
      const updatedFood = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated = {
        $set: {
           price: updatedFood.price,
           userName: updatedFood.userName,
           userEmail: updatedFood.userEmail,
           foodName: updatedFood.foodName,
           foodOrigin: updatedFood.foodOrigin,
           foodImage: updatedFood.foodImage,
           foodCategory: updatedFood.foodCategory,
           quantity: updatedFood.quantity,
           description: updatedFood.description
        },
      };
      const result = await addFoodItemFoodCollection.updateOne(
        filter,
        updated,
        options
      );
      res.send(result);
    });




















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res) => {
  res.send("Restaurant Management Website is running...");
});

app.listen(port, () => {
  console.log(`Restaurant Management Website is Running on port ${port}`);
});