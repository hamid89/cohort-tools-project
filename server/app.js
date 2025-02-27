const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const Student = require("./models/studentSchema");
const Cohort = require("./models/chortSchema");
const PORT = 5005;
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
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
// creating new student record 
app.post("/api/students", async (req, res) => {
  try {
    const createdStudent = await Student.create(req.body);
    console.log("req.body while user creation:", req.body);
    if (createdStudent) return res.status(201).json(createdStudent);
  } catch (error) {
    console.log("error during student creation:", error);
    res.status(500).json({ error: error.message });
  }
});
// creating new cohort
app.post("/api/cohorts", async (req, res) => {
  try {
    const createdCohort = await Cohort.create(req.body);
    console.log("req.body while cohort creation:", req.body);
    if (createdCohort) return res.status(201).json(createdCohort);
  } catch (error) {
    console.log("error during cohort creation:", error);
    res.status(500).json({ error: error.message });
  }
});
// reading student record
app.get("/api/students/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id = new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Student.findOne({ _id: id })
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    })
    .catch((err) => {
      next(err);
    });
});
// student record update
app.put("/api/students/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id = new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Student.findByIdAndUpdate(id, req.body, { new: true })
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    })
    .catch((err) => {
      next(err);
    });
});
// student deletion
app.delete("/api/students/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id =  new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Student.findByIdAndDelete(id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    })
    .catch((err) => {
      next(err);
    });
});
// cohort record reading by id
app.get("/api/cohorts/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id = new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Cohort.findOne({ _id: id })
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ message: "cohort not found" });
      }
      res.json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});
// cohort update
app.put("/api/cohorts/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id =  new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Cohort.findByIdAndUpdate(id, req.body, { new: true })
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ message: "cohort not found" });
      }
      res.json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});
// cohort delete
app.delete("/api/cohorts/:id", (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  const id =  new mongoose.Types.ObjectId(req.params.id); 

  // Find the student by their _id
  Cohort.findByIdAndDelete(id)
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ message: "cohort not found" });
      }
      res.json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
