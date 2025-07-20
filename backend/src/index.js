import { app } from "./app.js";
import connectDB from "./db/index.js";

// config env using import statement + another partof setup is in package.json/scripts/start
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

//loading mongoDB ~ app
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("ERROR :", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection fail !! ", err);
  });

/*
// DB & app both are connected here
import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import express from "express";
const app = express();


(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); // database connected
    // using app
    app.on("error", (error) => {
      console.error("ERROR :", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR :", error);
    throw error;
  }
})();
*/
