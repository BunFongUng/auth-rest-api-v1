import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import routes from "./modules";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// connect to MongoDB
const mongoUrl = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB has connected!");
  })
  .catch(err => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// testing route
app.get("/", (req, res) => {
  console.log("Hello");
  return res.send();
});

// api v1 routes
app.use("/api/v1", routes);

export default app;
