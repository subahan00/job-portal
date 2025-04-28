const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Database connection error:", err));

// Initializing directories for file uploads
const directories = ["./public", "./public/resume", "./public/profile"];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const app = express();
const port = 4444;

// Middleware configurations
app.use(bodyParser.json()); // Support JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize()); // Passport initialization

// Serve static files from public directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Routing setup
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("Job Portal API is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});