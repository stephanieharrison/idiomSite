const express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const CONNECTION_URL =
  "mongodb+srv://" +
  process.env.USERNAME_MONGO +
  ":" +
  process.env.PASSWORD_MONGO +
  "@cluster0-eoik8.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "idioms";

var app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

var database, collection;

app.get("/", (req, res) => {
  res.render("homePage.ejs", { idioms: collection });
});

app.get("/i/:idiom", (req, res) => {
  var idiomName = req.params.idiom;
  idiomName = idiomName.replace("-", " ");
  console.log(idiomName);
  var name = "name";
  collection.findOne({ name: idiomName }, (err, result) => {
    res.render("idiomPage.ejs", { idiom: result });
  });
});

app.get("/search/api/:value", (req, res) => {
  var value = req.params.value;
  respAnswer = [];
  collection.find({ name: { $regex: value } }).toArray((error, result) => {
    if (error) {
      console.log("ERROR");
    } else {
      res.send(JSON.stringify(result));
    }
  });
});

app.listen(3000, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("idiomsList");
      console.log("Connected to `" + DATABASE_NAME + "`!");
    }
  );
});
