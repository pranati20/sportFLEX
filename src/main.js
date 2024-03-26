const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const connectToDatabase = require("./teamsConfig");
const MongoClient = require("mongodb").MongoClient;

// const Team = require("./teamsConfig");
const url = "mongodb://localhost:27017/login";

let Team; // Declare Team as a global variable

async function startServer() {
  try {
    Team = await connectToDatabase(); // Assign the Team model to the global variable
    // Your server startup logic here
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer(); // Don't forget to call startServer

const app = express();
const collection = require("./config");
const Admin = require("./adminConfig");
const Host = require("./hostConfig"); // Import the Host model
const SportsVenue = require("./hostsports");
// const teamModel = require("./teamsConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(
  express.static(path.join(__dirname, "../public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
console.log(Admin.schema.obj);
console.log("Host schema:", Host.schema.obj); // Log the Host schema to verify

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ name: req.body.username });
    if (!user) {
      return res.send("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      return res.render("home");
    } else {
      return res.send("Incorrect password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("An unexpected error occurred");
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  try {
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
      return res.send(
        "User already exists. Please choose a different username."
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    await collection.create(data);
    res.redirect("/home");
  } catch (error) {
    console.error("Error occurred during signup:", error);
    res.status(500).send("An unexpected error occurred during signup.");
  }
});

app.get("/adminLogin", (req, res) => {
  res.render("adminLogin"); // Render the admin login form
});

// Define a route handler for inserting admin data
app.post("/insertAdmin", async (req, res) => {
  try {
    // Sample admin data to insert
    const adminData = [
      {
        username: "admin2",
        password: "admin2pass",
      },
      {
        username: "admin1",
        password: "admin1pass",
      },
    ];

    // Insert admin data into the Admin collection
    const insertedAdmin = await Admin.create(adminData);
    res.send("Admin data inserted successfully: " + insertedAdmin);
  } catch (error) {
    console.error("Error occurred while inserting admin data:", error);
    res.status(500).send("An unexpected error occurred");
  }
});
app.post("/adminLogin", async (req, res) => {
  try {
    const adminUsername = req.body.username;
    const adminPassword = req.body.password;

    // Find admin by username
    const admin = await Admin.findOne({ username: adminUsername });

    if (!admin) {
      console.log("Admin not found for username:", adminUsername);
      return res.send("Admin not found");
    }

    // Compare plaintext passwords
    if (admin.password === adminPassword) {
      console.log("Admin logged in successfully:", adminUsername);
      return res.render("home"); // Redirect admin to home upon successful login
    } else {
      console.log("Incorrect admin password for username:", adminUsername);
      return res.send("Incorrect admin password");
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res
      .status(500)
      .send("An unexpected error occurred during admin login.");
  }
});

//hosts

app.get("/hostLogin", (req, res) => {
  // Render the host login page or perform any other necessary actions
  res.render("hostLogin");
});

app.get("/hostSignup", (req, res) => {
  // Render the host login page or perform any other necessary actions
  res.render("hostSignup");
});

app.post("/hostSignup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the host already exists
    const existingHost = await Host.findOne({ username });
    if (existingHost) {
      return res.send(
        "Host already exists. Please choose a different username."
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new host document in the hosts collection
    await Host.create({ username, password: hashedPassword });

    // Redirect the host to the login page
    res.redirect("/HostSport.ejs");
  } catch (error) {
    console.error("Error occurred during host signup:", error);
    res.status(500).send("An unexpected error occurred during host signup.");
  }
});
app.post("/hostLogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the host by username
    const host = await Host.findOne({ username });
    if (!host) {
      return res.send("Host not found");
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, host.password);
    if (isPasswordMatch) {
      // Redirect the host to the home page or dashboard
      res.redirect("/HostSport.ejs");
    } else {
      return res.send("Incorrect password");
    }
  } catch (error) {
    console.error("Error during host login:", error);
    return res
      .status(500)
      .send("An unexpected error occurred during host login.");
  }
});

//AdminSport : admin can enter the venue details which will be stored into a shared db between users and host
app.get("/HostSport.ejs", (req, res) => {
  res.render("HostSport");
});

app.get("/Venue.ejs", (req, res) => {
  res.render("Venue");
});

app.get("/api/sportsvenues", async (req, res) => {
  try {
    let query = {}; // Initialize an empty query object

    // Check if the sports query parameter is provided
    if (req.query.sports) {
      const sports = req.query.sports.split(","); // Split the sports parameter into an array
      query = { sport: { $in: sports } }; // Construct the query to filter venues by sports
    }

    // Fetch venues based on the constructed query
    const venues = await SportsVenue.find(query);
    res.json(venues);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).json({ error: "Error fetching venues" });
  }
});

app.get("/api/sportsvenues", async (req, res) => {
  try {
    const venues = await SportsVenue.find();
    res.json(venues);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).json({ error: "Error fetching venues" });
  }
});

// Configure Multer to handle file uploads

const storageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // Update destination path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storageMulter });

app.post("/submitVenue", upload.single("image"), (req, res) => {
  // Log the request body and uploaded file
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { sport, players, fromTime, toTime, pricing, address } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Get the relative path of the uploaded image file, if available

  // Log the values of all the fields
  console.log("sport:", sport);
  console.log("players:", players);
  console.log("fromTime:", fromTime);
  console.log("toTime:", toTime);
  console.log("pricing:", pricing);
  console.log("address:", address);
  console.log("imagePath:", imagePath);

  // Check if required fields are provided
  if (!pricing || !address) {
    return res.status(400).send("Pricing and address are required fields");
  }

  // Create a new venue document with image path
  const newVenue = new SportsVenue({
    sport,
    players,
    fromTime,
    toTime,
    pricing,
    address,
    imagePath,
  });

  newVenue
    .save()
    .then(() => {
      res.send("Venue Updated");
    })
    .catch((err) => {
      console.error("Error saving venue:", err); // Log the error to the console
      res.status(500).send("Error submitting venue: " + err.message); // Send a more informative error message to the client
    });
});
app.post("/generateTeamId", async (req, res) => {
  const teamName = req.body.teamName;
  const numPlayers = req.body.numPlayers;

  // Generate a random team ID

  const teamId = teamName + Math.floor(1000 + Math.random() * 9000);

  // Connect to the database and get the Team model
  const Team = await connectToDatabase();

  // Create a new team
  const team = new Team({
    teamID: teamId,
    numPlayers: numPlayers,
  });

  // Save the team to the database
  try {
    await team.save();
    console.log("Team saved to database");
    // Send the team ID back to the client
    res.json({ teamId: teamId });
  } catch (err) {
    console.error("Error saving team to database:", err);
    res.status(500).send("Error saving team to database");
  }
});
app.post("/verifyTeamId", async (req, res) => {
  const teamId = req.body.teamId;

  // Connect to the database and get the Team model
  const Team = await connectToDatabase();

  // Check if the team ID is registered
  const team = await Team.findOne({ teamID: teamId });

  if (team) {
    // The team ID is registered
    res.json({ isValid: true });
  } else {
    // The team ID is not registered
    res.json({ isValid: false });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log("Server is running");
});
