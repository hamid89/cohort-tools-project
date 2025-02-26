const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { MongoClient } = require("mongodb");
const mongoURI = "mongodb://localhost:27017";
const PORT = 5005;

const mongoURI = "mongodb://localhost:27017";
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
let db;
MongoClient.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("MongoDB Connected");
    db = client.db("cohort-tools-api"); // Specify your database name
  })
  .catch((err) => console.error("MongoDB connection error: ", err));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res, next) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.get("/api/cohorts", (req, res, next) => {
  const collection = db.collection("cohorts"); // Specify your collection name
  collection
    .find()
    .toArray()
    .then((cohorts) => {
      res.json(cohorts); // Return the whole collection as a JSON response
    })
    .catch((err) => {
      next(err); // Pass any errors to the error handler
    });
});
app.get("/api/students", (req, res, next) => {
  const collection = db.collection("students"); // Specify your collection name
  collection
    .find()
    .toArray()
    .then((students) => {
      res.json(students); // Return the whole collection as a JSON response
    })
    .catch((err) => {
      next(err); // Pass any errors to the error handler
    });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
