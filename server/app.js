require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const Student = require("./models/studentSchema");
const Cohort = require("./models/chortSchema");
const User = require("./models/userSchema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const PORT = process.env.PORT || 5005;
const MONGODB_URL = process.env.MONGODB_URL;
const saltRounds = 10;

mongoose
  .connect(MONGODB_URL)
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
app.use(cors());
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
app.post("/api/students", isAuthenticated, async (req, res) => {
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
app.post("/api/cohorts", isAuthenticated, async (req, res) => {
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
app.get("/api/students/:id", isAuthenticated, (req, res, next) => {
  try {
    // const userId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.params.id;

    console.log("id:", userId);

    Student.findOne({ _id: userId })
      .then((student) => {
        if (!student) {
          console.error("Invalid studentId:", studentId);
          return res.status(404).json({ message: "Student not found" });
        }
        console.log("student found:", student);
        res.json(student);
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// student record update
app.put("/api/students/:id", isAuthenticated, (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  // const id = new mongoose.Types.ObjectId(req.params.id);
  const id = req.params.id;

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
app.delete("/api/students/:id", isAuthenticated, (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  // const id = new mongoose.Types.ObjectId(req.params.id);

  const id = req.params.id;

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
app.get("/api/cohorts/:id", isAuthenticated, (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  // const id = new mongoose.Types.ObjectId(req.params.id);

  const id = req.params.id;
  // Find the student by their _id
  Cohort.findOne({ _id: id })
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ message: "cohort not found" });
      }
      console.log(cohort);
      res.json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});
// cohort update
app.put("/api/cohorts/:id", isAuthenticated, (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  // const id = new mongoose.Types.ObjectId(req.params.id);

  const id = req.params.id;

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
app.delete("/api/cohorts/:id", isAuthenticated, (req, res, next) => {
  // Convert the id to a MongoDB ObjectId type
  // const id = new mongoose.Types.ObjectId(req.params.id);

  const id = req.params.id;

  // Find and delete the cohort by its UUID _id
  Cohort.findByIdAndDelete(id)
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/auth/signup", isAuthenticated, (req, res, next) => {
  // receive the data from the request body
  const { email, password, name } = req.body;

  //data validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // hash the password
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  //create a new user
  User.create({ name, email, password: hashedPassword })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.post("/auth/login", (req, res, next) => {
  // receive the data from the request body
  const { email, password } = req.body;

  //data validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const correctPassword = bcrypt.compareSync(password, user.password);

      //compare the password
      if (correctPassword) {
        // Create the payload
        const payload = {
          userId: user._id,
          email: user.email,
        };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ message: "Login successful", user, authToken });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.get("/api/students/cohort/:cohortId", isAuthenticated, (req, res, next) => {
  const cohortId = req.params.cohortId;

  Student.find({ cohort: cohortId })
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/users/:id", isAuthenticated, (req, res, next) => {
  const userId = req.params.id;
  console.log("userId in /api/users/:id", userId);
  User.findOne({ _id: userId })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/auth/verify", isAuthenticated, (req, res, next) => {
  console.log("req.user", req.payload);
  res.status(200).json(req.payload);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
