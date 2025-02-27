const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const Student = require("./models/studentSchema");
const Cohort = require("./models/chortSchema");
const PORT = 5005;
const mongoose = require("mongoose");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// comment
// let db;
// MongoClient.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then((client) => {
//     console.log("MongoDB Connected");
//     db = client.db("rest-api-project"); // Specify your database name
//   })
//   .catch((err) => console.error("MongoDB connection error: ", err));

mongoose
  .connect("mongodb://localhost:27017/rest-api-project")
  .then((response) => {
    const databaseName = response.connections[0]?.name;
    console.log("Mongoose connected to the", databaseName);
  })
  .catch((err) => {
    console.log("Error occured while connecting to the database:", err);
  });

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res, next) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then((cohorts) => {
      console.log("cohorts received with mongoose syntax!");
      res.json(cohorts); // Return the whole collection as a JSON response
    })
    .catch((err) => {
      next(err); // Pass any errors to the error handler
    });
});
app.get("/api/students", (req, res, next) => {
  Student.find()
    .then((students) => {
      console.log("students received with mongoose syntax!");
      res.json(students); // Return the whole collection as a JSON response
    })
    .catch((err) => {
      next(err); // Pass any errors to the error handler
    });
});
// app.use((req, res) => {
//   res.status(500).send("Something went wrong!");
// });

app.post("/api/students", async (req, res) => {
  try {
    const createdUser = await Student.create(req.body);
    console.log("req.body while user creation:", req.body);
    if (createdUser) return res.status(201).json(createdUser);
  } catch (error) {
    console.log("error during user creation:", error);
    res.status(500).json({ error: error.message });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
